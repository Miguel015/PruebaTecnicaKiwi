#!/usr/bin/env pwsh
Write-Host "Kiwi Challenge — Dev setup script" -ForegroundColor Cyan

Write-Host "Installing root dev dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Installing server dependencies..." -ForegroundColor Yellow
npm --prefix server install

Write-Host "Installing client dependencies..." -ForegroundColor Yellow
npm --prefix client install

Write-Host "Starting development servers (server + client)..." -ForegroundColor Green
npm run dev
