#!/usr/bin/env node

import https from 'https';
import http from 'http';
import { URL } from 'url';

// Конфигурация
const CONFIG = {
    url: 'http://192.168.1.67/v1/projects/3e76e87d-ffab-44e8-84c1-c0f9191c139d/chats/425ef49c-d26b-4643-a1b9-11b9e5a4b36f/messages',
    method: 'POST',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMzk1Zjc5Ny1mYjhhLTQxN2QtYmYzZi04MGExNjdkMGFjMTUiLCJlbWFpbCI6ImJvYkBnbWFpbC5jb20iLCJyb2xlIjoiY2xpZW50IiwicGVybWlzc2lvbnMiOlsidmlld19vd25fcHJvamVjdHMiLCJjcmVhdGVfcHJvamVjdHMiLCJ1cGRhdGVfb3duX3Byb2plY3RzIiwidmlld19hc3NpZ25lZF9wcm9qZWN0cyIsImRlbGV0ZV9vd25fcHJvamVjdHMiLCJtYW5hZ2VfcHJvamVjdF90YXNrcyIsImNyZWF0ZV90YXNrcyIsInVwZGF0ZV90YXNrX3N0YXR1cyIsInZpZXdfYXNzaWduZWRfdGFza3MiLCJ2aWV3X3Byb2plY3RfY2hhdHMiLCJjcmVhdGVfY2hhdHMiLCJ1cGRhdGVfY2hhdHMiLCJzZW5kX21lc3NhZ2VzIl0sImlhdCI6MTc2MDI3NjIwNiwiZXhwIjoxNzYwMzYyNjA2fQ.1N4eCUBz86gQuDxS_68FEJZ71R77d9ff4IpNB7fg6xM',
    payload: {
        content: "some chat",
        type: 'text',
    },
    totalRequests: 25,
    timeout: 30000 // 30 секунд таймаут
};

// Функция для отправки одного запроса
function sendRequest(requestId) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const url = new URL(CONFIG.url);

        const postData = JSON.stringify(CONFIG.payload);

        const options = {
            hostname: url.hostname,
            port: url.port || (url.protocol === 'https:' ? 443 : 80),
            path: url.pathname + url.search,
            method: CONFIG.method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'Authorization': `Bearer ${CONFIG.token}`,
                'User-Agent': `LoadTest-${requestId}`,
                'Accept': 'application/json'
            },
            timeout: CONFIG.timeout
        };

        const client = url.protocol === 'https:' ? https : http;

        const req = client.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                resolve({
                    requestId,
                    statusCode: res.statusCode,
                    responseTime,
                    success: res.statusCode >= 200 && res.statusCode < 300,
                    dataLength: data.length,
                    response: data.length > 200 ? data.substring(0, 200) + '...' : data
                });
            });
        });

        req.on('error', (error) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            resolve({
                requestId,
                statusCode: 0,
                responseTime,
                success: false,
                error: error.message,
                response: null
            });
        });

        req.on('timeout', () => {
            req.destroy();
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            resolve({
                requestId,
                statusCode: 0,
                responseTime,
                success: false,
                error: 'Request timeout',
                response: null
            });
        });

        // Отправляем данные
        req.write(postData);
        req.end();
    });
}

// Функция для запуска нагрузочного теста
async function runLoadTest() {
    console.log('🚀 Запуск нагрузочного тестирования...');
    console.log(`📡 URL: ${CONFIG.url}`);
    console.log(`📊 Количество запросов: ${CONFIG.totalRequests}`);
    console.log(`💾 Payload: ${JSON.stringify(CONFIG.payload)}`);
    console.log(`🔑 Token: ${CONFIG.token.substring(0, 20)}...`);
    console.log('');

    const startTime = Date.now();

    // Создаем массив промисов для параллельного выполнения
    const requests = [];
    for (let i = 1; i <= CONFIG.totalRequests; i++) {
        requests.push(sendRequest(i));
    }

    console.log('⏳ Отправка запросов...');

    // Выполняем все запросы параллельно
    const results = await Promise.all(requests);

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Анализируем результаты
    const stats = {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        totalTime: totalTime,
        avgResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
        minResponseTime: Math.min(...results.map(r => r.responseTime)),
        maxResponseTime: Math.max(...results.map(r => r.responseTime)),
        requestsPerSecond: (results.length / totalTime) * 1000
    };

    // Группируем по статус кодам
    const statusCodes = {};
    results.forEach(r => {
        const code = r.statusCode || 'ERROR';
        statusCodes[code] = (statusCodes[code] || 0) + 1;
    });

    // Выводим результаты
    console.log('\n📈 РЕЗУЛЬТАТЫ НАГРУЗОЧНОГО ТЕСТИРОВАНИЯ:');
    console.log('='.repeat(50));
    console.log(`✅ Успешных запросов: ${stats.successful} из ${stats.total}`);
    console.log(`❌ Неудачных запросов: ${stats.failed}`);
    console.log(`⏱️  Общее время: ${stats.totalTime} мс (${(stats.totalTime/1000).toFixed(2)} сек)`);
    console.log(`📊 Запросов в секунду: ${stats.requestsPerSecond.toFixed(2)}`);
    console.log('');
    console.log('⏰ ВРЕМЯ ОТКЛИКА:');
    console.log(`   Среднее: ${stats.avgResponseTime.toFixed(2)} мс`);
    console.log(`   Минимальное: ${stats.minResponseTime} мс`);
    console.log(`   Максимальное: ${stats.maxResponseTime} мс`);
    console.log('');
    console.log('📋 СТАТУС КОДЫ:');
    Object.entries(statusCodes).forEach(([code, count]) => {
        const emoji = code >= 200 && code < 300 ? '✅' : code >= 400 ? '❌' : '⚠️';
        console.log(`   ${emoji} ${code}: ${count} запросов`);
    });

    // Показываем ошибки если есть
    const errors = results.filter(r => !r.success);
    if (errors.length > 0) {
        console.log('\n🔴 ОШИБКИ:');
        const errorGroups = {};
        errors.forEach(r => {
            const errorKey = r.error || `HTTP ${r.statusCode}`;
            errorGroups[errorKey] = (errorGroups[errorKey] || 0) + 1;
        });

        Object.entries(errorGroups).forEach(([error, count]) => {
            console.log(`   ❌ ${error}: ${count} раз`);
        });
    }

    // Показываем несколько примеров ответов
    const successfulResponses = results.filter(r => r.success && r.response);
    if (successfulResponses.length > 0) {
        console.log('\n✅ ПРИМЕРЫ УСПЕШНЫХ ОТВЕТОВ:');
        successfulResponses.slice(0, 3).forEach((r, i) => {
            console.log(`   ${i + 1}. Request #${r.requestId} (${r.statusCode}): ${r.response}`);
        });
    }

    console.log('\n🏁 Тестирование завершено!');

    // Возвращаем код выхода
    process.exit(stats.failed > 0 ? 1 : 0);
}

// Обработка сигналов
process.on('SIGINT', () => {
    console.log('\n⚠️  Тест прерван пользователем');
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Необработанная ошибка:', error);
    process.exit(1);
});

// Запускаем тест
runLoadTest().catch((error) => {
    console.error('❌ Ошибка при запуске теста:', error);
    process.exit(1);
});
