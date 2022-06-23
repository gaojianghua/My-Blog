/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // 图片域名白名单
    images: {
        domains: []
    }
};

const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
