#!/usr/bin/env node

import https from 'https';
import http from 'http';
import { URL } from 'url';

// Конфигурация
const CONFIG = {
    url: 'http://127.0.0.1/v1/projects/17/chats/1/messages',
    method: 'POST',
    token: '818|CGYHRd2t4Iz7KvSWkMhiKYJC4UvdXcDbFrLL6RlWa32f52c3',
    payload: {
        message: "some chat"
    },
    totalRequests: 200,
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
