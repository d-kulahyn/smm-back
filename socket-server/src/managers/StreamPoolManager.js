export class StreamPoolManager {
    constructor(options = {}) {
        this.options = {
            poolSize: options.poolSize || 100,
            maxPools: options.maxPools || 10,
            poolRotationTime: options.poolRotationTime || 5000,
            priorityStreams: options.priorityStreams || [],
            ...options
        };

        this.activePools = new Map();
        this.streamQueue = new Set();
        this.lastActivity = new Map();
        this.streamPriority = new Map();

        this._initializePriorityStreams();
    }

    _initializePriorityStreams() {
        this.options.priorityStreams.forEach(streamName => {
            this.streamPriority.set(streamName, 1);
        });
    }

    addStream(streamName, priority = 0) {
        this.streamQueue.add(streamName);
        this.streamPriority.set(streamName, priority);
        this.lastActivity.set(streamName, Date.now());
    }

    removeStream(streamName) {
        this.streamQueue.delete(streamName);
        this.streamPriority.delete(streamName);
        this.lastActivity.delete(streamName);

        for (const [poolId, streams] of this.activePools.entries()) {
            const index = streams.indexOf(streamName);
            if (index !== -1) {
                streams.splice(index, 1);
                if (streams.length === 0) {
                    this.activePools.delete(poolId);
                }
            }
        }
    }

    createProcessingPools() {
        const pools = [];
        const sortedStreams = this._getSortedStreams();

        for (let i = 0; i < sortedStreams.length; i += this.options.poolSize) {
            const pool = sortedStreams.slice(i, i + this.options.poolSize);
            pools.push(pool);

            if (pools.length >= this.options.maxPools) {
                break;
            }
        }

        return pools;
    }

    _getSortedStreams() {
        return Array.from(this.streamQueue).sort((a, b) => {
            const priorityA = this.streamPriority.get(a) || 0;
            const priorityB = this.streamPriority.get(b) || 0;
            if (priorityA !== priorityB) {
                return priorityB - priorityA;
            }

            const activityA = this.lastActivity.get(a) || 0;
            const activityB = this.lastActivity.get(b) || 0;
            return activityB - activityA;
        });
    }

    updateActivity(streamName) {
        if (this.streamQueue.has(streamName)) {
            this.lastActivity.set(streamName, Date.now());
        }
    }

    cleanupInactiveStreams(maxInactiveTime = 3600000) { // 1 hour by default
        const now = Date.now();
        const inactiveStreams = [];

        for (const [streamName, lastActivity] of this.lastActivity.entries()) {
            if (now - lastActivity > maxInactiveTime) {
                inactiveStreams.push(streamName);
            }
        }

        inactiveStreams.forEach(streamName => {
            this.removeStream(streamName);
        });

        return inactiveStreams;
    }

    /**
     * Gets pool statistics in human-readable format
     */
    getStats() {
        const totalStreams = this.streamQueue.size;
        const activePools = this.activePools.size;
        const priorityStreamsCount = Array.from(this.streamPriority.entries())
            .filter(([_, priority]) => priority > 0).length;
        const avgPoolSize = activePools > 0
            ? Array.from(this.activePools.values())
                .reduce((sum, pool) => sum + pool.length, 0) / activePools
            : 0;

        return {
            // Raw numbers for internal use
            totalStreams,
            activePools,
            priorityStreams: priorityStreamsCount,
            avgPoolSize,

            // Human-readable descriptions
            humanReadable: {
                totalStreams: `${totalStreams.toLocaleString()} active streams`,
                activePools: `${activePools} pools in processing`,
                priorityStreams: `${priorityStreamsCount} priority streams`,
                avgPoolSize: `${Math.round(avgPoolSize)} streams average per pool`,
                processingCapacity: `up to ${(activePools * avgPoolSize).toLocaleString()} streams simultaneously`,
                memoryUsage: this._getMemoryEstimate(totalStreams),
                efficiency: this._getEfficiencyDescription(totalStreams, activePools)
            }
        };
    }

    /**
     * Estimates memory usage
     */
    _getMemoryEstimate(totalStreams) {
        // Rough estimate: each stream takes ~200 bytes in Node.js memory
        const estimatedBytes = totalStreams * 200;

        if (estimatedBytes < 1024) {
            return `${estimatedBytes} bytes memory`;
        } else if (estimatedBytes < 1024 * 1024) {
            return `${Math.round(estimatedBytes / 1024)} KB memory`;
        } else {
            return `${Math.round(estimatedBytes / 1024 / 1024)} MB memory`;
        }
    }

    /**
     * System efficiency description
     */
    _getEfficiencyDescription(totalStreams, activePools) {
        if (totalStreams === 0) {
            return 'System waiting for streams';
        } else if (totalStreams < 100) {
            return 'Low load - system underutilized';
        } else if (totalStreams < 1000) {
            return 'Medium load - optimal performance';
        } else if (totalStreams < 10000) {
            return 'High load - system working intensively';
        } else {
            return 'Extreme load - maximum performance';
        }
    }
}
