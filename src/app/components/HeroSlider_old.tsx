"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "API Entegrasyonu",
    svg: (
      <svg viewBox="0 0 1920 1080" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 0.9 }} />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#60a5fa", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "#a78bfa", stopOpacity: 0.3 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="1"/>
          </pattern>
        </defs>
        
        {/* Background grid */}
        <rect width="1920" height="1080" fill="url(#grid)" opacity="0.3"/>
        
        {/* Main server infrastructure */}
        <g transform="translate(300, 300)">
          {/* Left Server Cluster */}
          <rect x="0" y="0" width="280" height="380" fill="#18181b" stroke="#3b82f6" strokeWidth="4" rx="12" filter="url(#glow)"/>
          <rect x="10" y="10" width="260" height="50" fill="#27272a" stroke="#3b82f6" strokeWidth="2" rx="6"/>
          <text x="140" y="42" fill="#60a5fa" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="monospace">API SERVER</text>
          
          {/* Server rack details */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(20, ${80 + i * 55})`}>
              <rect width="240" height="45" fill="#09090b" stroke="#3b82f6" strokeWidth="2" rx="4"/>
              {/* LED indicators */}
              {[0, 1, 2, 3].map((j) => (
                <circle key={j} cx={20 + j * 25} cy="22" r="4" fill="#10b981">
                  <animate attributeName="opacity" values="1;0.3;1" dur={`${1.5 + j * 0.2}s`} repeatCount="indefinite"/>
                </circle>
              ))}
              {/* Port indicators */}
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <rect key={k} x={120 + k * 18} y="15" width="12" height="14" fill="#3b82f6" opacity="0.4" rx="2"/>
              ))}
            </g>
          ))}
        </g>
        
        {/* Right Server Cluster */}
        <g transform="translate(1340, 300)">
          <rect x="0" y="0" width="280" height="380" fill="#18181b" stroke="#8b5cf6" strokeWidth="4" rx="12" filter="url(#glow)"/>
          <rect x="10" y="10" width="260" height="50" fill="#27272a" stroke="#8b5cf6" strokeWidth="2" rx="6"/>
          <text x="140" y="42" fill="#a78bfa" fontSize="24" fontWeight="bold" textAnchor="middle" fontFamily="monospace">DATABASE</text>
          
          {/* Database cylinders */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(50, ${100 + i * 80})`}>
              <ellipse cx="90" cy="0" rx="70" ry="20" fill="#18181b" stroke="#8b5cf6" strokeWidth="3"/>
              <rect x="20" y="0" width="140" height="50" fill="#18181b" stroke="#8b5cf6" strokeWidth="3"/>
              <ellipse cx="90" cy="50" rx="70" ry="20" fill="#27272a" stroke="#8b5cf6" strokeWidth="3"/>
              {/* Data flow lines */}
              {[0, 1, 2, 3].map((j) => (
                <line key={j} x1={30 + j * 40} y1="10" x2={30 + j * 40} y2="40" stroke="#a78bfa" strokeWidth="2">
                  <animate attributeName="y1" values="10;40;10" dur="2s" repeatCount="indefinite" begin={`${j * 0.3}s`}/>
                  <animate attributeName="y2" values="40;10;40" dur="2s" repeatCount="indefinite" begin={`${j * 0.3}s`}/>
                </line>
              ))}
            </g>
          ))}
        </g>
        
        {/* Central API Gateway */}
        <g transform="translate(860, 400)">
          <rect x="0" y="0" width="200" height="180" fill="#18181b" stroke="url(#grad1)" strokeWidth="4" rx="12" filter="url(#glow)"/>
          <text x="100" y="35" fill="#ffffff" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="monospace">API</text>
          <text x="100" y="60" fill="#a78bfa" fontSize="16" textAnchor="middle" fontFamily="monospace">GATEWAY</text>
          
          {/* API routes visualization */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(20, ${80 + i * 22})`}>
              <rect width="160" height="18" fill="#27272a" rx="3"/>
              <text x="10" y="13" fill="#60a5fa" fontSize="10" fontFamily="monospace">/api/v1/{['users', 'products', 'orders', 'analytics'][i]}</text>
              <circle cx="150" cy="9" r="3" fill="#10b981">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.2}s`}/>
              </circle>
            </g>
          ))}
        </g>
        
        {/* Connection paths with data packets */}
        {/* Left to Center */}
        <path d="M 580 490 Q 760 400, 860 490" stroke="url(#grad1)" strokeWidth="6" fill="none" opacity="0.6" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="15" dur="1s" repeatCount="indefinite"/>
        </path>
        {/* Center to Right */}
        <path d="M 1060 490 Q 1240 400, 1340 490" stroke="url(#grad1)" strokeWidth="6" fill="none" opacity="0.6" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="15" dur="1s" repeatCount="indefinite"/>
        </path>
        
        {/* Animated data packets */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx="580" cy="490" r="12" fill="#ef4444" filter="url(#glow)">
              <animateMotion path="M 0 0 Q 180 -90, 280 0" dur="3s" repeatCount="indefinite" begin={`${i * 1}s`}/>
            </circle>
            <circle cx="1060" cy="490" r="12" fill="#10b981" filter="url(#glow)">
              <animateMotion path="M 0 0 Q 180 -90, 280 0" dur="3s" repeatCount="indefinite" begin={`${i * 1}s`}/>
            </circle>
          </g>
        ))}
        
        {/* Code symbols floating */}
        <text x="750" y="300" fill="#3b82f6" fontSize="48" fontFamily="monospace" opacity="0.4">{"{ }"}</text>
        <text x="1120" y="300" fill="#8b5cf6" fontSize="48" fontFamily="monospace" opacity="0.4">{"[ ]"}</text>
        <text x="920" y="750" fill="#60a5fa" fontSize="36" fontFamily="monospace" opacity="0.3">{"</>"}</text>
        
        {/* Status indicators */}
        <g transform="translate(820, 200)">
          <rect width="280" height="60" fill="#18181b" stroke="#52525b" strokeWidth="2" rx="8"/>
          <text x="20" y="35" fill="#10b981" fontSize="18" fontWeight="bold">● ONLINE</text>
          <text x="140" y="35" fill="#60a5fa" fontSize="18" fontWeight="bold">99.9% UPTIME</text>
        </g>
      </svg>
    )
  },
  {
    id: 2,
    title: "Bulut Altyapısı",
    svg: (
      <svg viewBox="0 0 1920 1080" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#06b6d4", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "#3b82f6", stopOpacity: 0.9 }} />
          </linearGradient>
          <filter id="cloudGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="cloudGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="#22d3ee" opacity="0.2"/>
          </pattern>
        </defs>
        
        {/* Background pattern */}
        <rect width="1920" height="1080" fill="url(#cloudGrid)"/>
        
        {/* Large cloud structure */}
        <g transform="translate(500, 200)">
          {/* Main cloud body */}
          <ellipse cx="460" cy="150" rx="380" ry="120" fill="url(#cloudGrad)" opacity="0.15" filter="url(#cloudGlow)"/>
          <ellipse cx="300" cy="180" rx="250" ry="100" fill="url(#cloudGrad)" opacity="0.2" filter="url(#cloudGlow)"/>
          <ellipse cx="620" cy="180" rx="250" ry="100" fill="url(#cloudGrad)" opacity="0.2" filter="url(#cloudGlow)"/>
          <ellipse cx="460" cy="200" rx="320" ry="90" fill="url(#cloudGrad)" opacity="0.25" filter="url(#cloudGlow)"/>
          <rect x="200" y="180" width="520" height="100" fill="url(#cloudGrad)" opacity="0.18"/>
          
          {/* Cloud computing text */}
          <text x="460" y="120" fill="#22d3ee" fontSize="36" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CLOUD INFRASTRUCTURE</text>
          
          {/* Server clusters inside cloud */}
          <g transform="translate(180, 200)">
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i} transform={`translate(${i * 120}, 0)`}>
                <rect width="100" height="140" fill="#18181b" stroke="#06b6d4" strokeWidth="3" rx="8" filter="url(#cloudGlow)"/>
                <rect x="10" y="10" width="80" height="25" fill="#0e7490" rx="4"/>
                <text x="50" y="28" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">NODE-{i + 1}</text>
                
                {/* Server modules */}
                {[0, 1, 2].map((j) => (
                  <g key={j} transform={`translate(15, ${45 + j * 30})`}>
                    <rect width="70" height="22" fill="#0e7490" stroke="#22d3ee" strokeWidth="1" rx="3"/>
                    {[0, 1, 2, 3].map((k) => (
                      <circle key={k} cx={12 + k * 18} cy="11" r="3" fill="#10b981">
                        <animate attributeName="opacity" values="1;0.3;1" dur={`${1 + (i + j + k) * 0.1}s`} repeatCount="indefinite"/>
                      </circle>
                    ))}
                  </g>
                ))}
              </g>
            ))}
          </g>
        </g>
        
        {/* Data transfer arrows */}
        <defs>
          <marker id="arrowUp" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
            <polygon points="0,8 6,0 12,8" fill="#22d3ee"/>
          </marker>
          <marker id="arrowDown" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
            <polygon points="0,0 6,8 12,0" fill="#3b82f6"/>
          </marker>
        </defs>
        
        {/* Upload streams */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`upload-${i}`}>
            <line x1={600 + i * 200} y1="650" x2={600 + i * 200} y2="450" stroke="#22d3ee" strokeWidth="4" strokeDasharray="10,5" markerEnd="url(#arrowUp)" opacity="0.6">
              <animate attributeName="stroke-dashoffset" from="0" to="15" dur="1s" repeatCount="indefinite"/>
            </line>
            {/* Data packets */}
            <circle cx={600 + i * 200} cy="650" r="8" fill="#22d3ee" filter="url(#cloudGlow)">
              <animate attributeName="cy" values="650;450;650" dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0;1" dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
            </circle>
          </g>
        ))}
        
        {/* Download streams */}
        {[0, 1, 2, 3].map((i) => (
          <line key={`download-${i}`} x1={700 + i * 200} y1="450" x2={700 + i * 200} y2="650" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,5" markerEnd="url(#arrowDown)" opacity="0.6">
            <animate attributeName="stroke-dashoffset" from="0" to="15" dur="1s" repeatCount="indefinite"/>
          </line>
        ))}
        
        {/* Ground level - user devices */}
        <g transform="translate(400, 700)">
          {/* Laptop */}
          <g transform="translate(100, 0)">
            <rect x="0" y="0" width="150" height="100" fill="#18181b" stroke="#06b6d4" strokeWidth="3" rx="6"/>
            <rect x="10" y="10" width="130" height="70" fill="#0e7490"/>
            <path d="M -20 100 L 190 100 L 170 115 L 0 115 Z" fill="#27272a" stroke="#06b6d4" strokeWidth="2"/>
          </g>
          
          {/* Tablet */}
          <g transform="translate(400, 20)">
            <rect x="0" y="0" width="100" height="130" fill="#18181b" stroke="#06b6d4" strokeWidth="3" rx="8"/>
            <rect x="10" y="15" width="80" height="100" fill="#0e7490"/>
            <circle cx="50" cy="120" r="4" fill="#22d3ee"/>
          </g>
          
          {/* Phone */}
          <g transform="translate(650, 30)">
            <rect x="0" y="0" width="60" height="110" fill="#18181b" stroke="#06b6d4" strokeWidth="3" rx="10"/>
            <rect x="8" y="12" width="44" height="78" fill="#0e7490"/>
            <rect x="22" y="4" width="16" height="5" fill="#18181b" rx="3"/>
            <circle cx="30" cy="98" r="3" fill="#22d3ee"/>
          </g>
          
          {/* Desktop */}
          <g transform="translate(850, 0)">
            <rect x="0" y="0" width="180" height="120" fill="#18181b" stroke="#06b6d4" strokeWidth="3" rx="6"/>
            <rect x="10" y="10" width="160" height="90" fill="#0e7490"/>
            <rect x="70" y="120" width="40" height="50" fill="#27272a" stroke="#06b6d4" strokeWidth="2"/>
            <path d="M 30 170 L 150 170 L 140 180 L 40 180 Z" fill="#27272a" stroke="#06b6d4" strokeWidth="2"/>
          </g>
        </g>
        
        {/* Performance metrics */}
        <g transform="translate(100, 100)">
          <rect width="320" height="180" fill="#18181b" stroke="#06b6d4" strokeWidth="3" rx="12" opacity="0.9"/>
          <text x="160" y="35" fill="#22d3ee" fontSize="22" fontWeight="bold" textAnchor="middle">CLOUD METRICS</text>
          
          <text x="30" y="70" fill="#ffffff" fontSize="16">Uptime:</text>
          <text x="270" y="70" fill="#10b981" fontSize="18" fontWeight="bold" textAnchor="end">99.99%</text>
          
          <text x="30" y="100" fill="#ffffff" fontSize="16">Latency:</text>
          <text x="270" y="100" fill="#10b981" fontSize="18" fontWeight="bold" textAnchor="end">&lt; 10ms</text>
          
          <text x="30" y="130" fill="#ffffff" fontSize="16">Throughput:</text>
          <text x="270" y="130" fill="#10b981" fontSize="18" fontWeight="bold" textAnchor="end">10 Gb/s</text>
          
          <text x="30" y="160" fill="#ffffff" fontSize="16">Active Nodes:</text>
          <text x="270" y="160" fill="#22d3ee" fontSize="18" fontWeight="bold" textAnchor="end">5/5</text>
        </g>
        
        {/* Floating icons */}
        <text x="1600" y="300" fill="#06b6d4" fontSize="64" opacity="0.3">☁</text>
        <text x="1650" y="500" fill="#3b82f6" fontSize="48" opacity="0.3">⚡</text>
        <text x="1550" y="700" fill="#22d3ee" fontSize="56" opacity="0.3">🔒</text>
      </svg>
    )
  },
  {
    id: 3,
    title: "Veri Analizi & İş Zekası",
    svg: (
      <svg viewBox="0 0 1920 1080" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#8b5cf6", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "#ec4899", stopOpacity: 0.9 }} />
          </linearGradient>
          <linearGradient id="chartGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#06b6d4", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 0.9 }} />
          </linearGradient>
          <filter id="dataGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background grid */}
        <defs>
          <pattern id="dataGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#27272a" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#dataGrid)" opacity="0.5"/>
        
        {/* Main dashboard frame */}
        <g transform="translate(200, 150)">
          <rect width="1520" height="780" fill="#09090b" stroke="#52525b" strokeWidth="4" rx="16"/>
          
          {/* Header */}
          <rect x="0" y="0" width="1520" height="80" fill="#18181b" stroke="#52525b" strokeWidth="2" rx="16"/>
          <text x="40" y="50" fill="#ffffff" fontSize="32" fontWeight="bold">Analytics Dashboard</text>
          <text x="1380" y="50" fill="#10b981" fontSize="24">● LIVE</text>
          
          {/* Main chart area - Large bar chart */}
          <g transform="translate(50, 120)">
            <rect width="900" height="580" fill="#18181b" stroke="#52525b" strokeWidth="3" rx="12"/>
            <text x="450" y="35" fill="#a78bfa" fontSize="22" fontWeight="bold" textAnchor="middle">Revenue Analysis (2024)</text>
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <text key={i} x="30" y={520 - i * 90} fill="#71717a" fontSize="14" textAnchor="end">${i * 20}K</text>
            ))}
            
            {/* Bar chart */}
            {[
              { month: 'Jan', value: 180, color: '#8b5cf6' },
              { month: 'Feb', value: 220, color: '#a78bfa' },
              { month: 'Mar', value: 280, color: '#8b5cf6' },
              { month: 'Apr', value: 320, color: '#a78bfa' },
              { month: 'May', value: 380, color: '#8b5cf6' },
              { month: 'Jun', value: 420, color: '#a78bfa' },
              { month: 'Jul', value: 460, color: '#8b5cf6' },
              { month: 'Aug', value: 440, color: '#a78bfa' },
              { month: 'Sep', value: 480, color: '#8b5cf6' },
              { month: 'Oct', value: 500, color: '#a78bfa' },
              { month: 'Nov', value: 520, color: '#8b5cf6' },
              { month: 'Dec', value: 550, color: '#a78bfa' }
            ].map((bar, i) => (
              <g key={i} transform={`translate(${80 + i * 65}, 0)`}>
                <rect x="0" y={520 - bar.value} width="50" height={bar.value} fill={bar.color} rx="4" filter="url(#dataGlow)">
                  <animate attributeName="height" values={`${bar.value};${bar.value + 20};${bar.value}`} dur="3s" repeatCount="indefinite" begin={`${i * 0.1}s`}/>
                  <animate attributeName="y" values={`${520 - bar.value};${520 - bar.value - 20};${520 - bar.value}`} dur="3s" repeatCount="indefinite" begin={`${i * 0.1}s`}/>
                </rect>
                <text x="25" y="545" fill="#71717a" fontSize="12" textAnchor="middle">{bar.month}</text>
              </g>
            ))}
            
            {/* Trend line overlay */}
            <path d="M 105 340 L 170 300 L 235 240 L 300 200 L 365 140 L 430 100 L 495 60 L 560 80 L 625 40 L 690 20 L 755 0 L 820 -30" 
                  transform="translate(0, 520)"
                  stroke="#ec4899" strokeWidth="4" fill="none" strokeDasharray="8,4" filter="url(#dataGlow)">
              <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/>
            </path>
            
            {/* Data points on trend line */}
            {[105, 170, 235, 300, 365, 430, 495, 560, 625, 690, 755, 820].map((x, i) => (
              <circle key={i} cx={x} cy={520 - [180, 220, 280, 320, 380, 420, 460, 440, 480, 500, 520, 550][i]} r="6" fill="#ec4899" filter="url(#dataGlow)">
                <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" begin={`${i * 0.15}s`}/>
              </circle>
            ))}
          </g>
          
          {/* KPI Cards */}
          <g transform="translate(1000, 120)">
            {/* Total Revenue */}
            <rect width="470" height="130" fill="#18181b" stroke="#8b5cf6" strokeWidth="3" rx="12"/>
            <text x="20" y="35" fill="#a78bfa" fontSize="18">Total Revenue</text>
            <text x="20" y="75" fill="#ffffff" fontSize="42" fontWeight="bold">$4.75M</text>
            <text x="20" y="105" fill="#10b981" fontSize="20">↑ +45.2%</text>
            <path d="M 300 40 L 330 65 L 360 50 L 390 75 L 420 55 L 450 80" stroke="#8b5cf6" strokeWidth="3" fill="none"/>
            
            {/* Active Users */}
            <g transform="translate(0, 160)">
              <rect width="470" height="130" fill="#18181b" stroke="#06b6d4" strokeWidth="3" rx="12"/>
              <text x="20" y="35" fill="#22d3ee" fontSize="18">Active Users</text>
              <text x="20" y="75" fill="#ffffff" fontSize="42" fontWeight="bold">24.8K</text>
              <text x="20" y="105" fill="#10b981" fontSize="20">↑ +12.5%</text>
              {/* Mini area chart */}
              <path d="M 300 90 L 330 75 L 360 80 L 390 65 L 420 70 L 450 55 L 450 90 L 300 90 Z" fill="#06b6d4" opacity="0.3"/>
              <path d="M 300 90 L 330 75 L 360 80 L 390 65 L 420 70 L 450 55" stroke="#06b6d4" strokeWidth="3" fill="none"/>
            </g>
            
            {/* Conversion Rate */}
            <g transform="translate(0, 320)">
              <rect width="470" height="130" fill="#18181b" stroke="#ec4899" strokeWidth="3" rx="12"/>
              <text x="20" y="35" fill="#f9a8d4" fontSize="18">Conversion Rate</text>
              <text x="20" y="75" fill="#ffffff" fontSize="42" fontWeight="bold">8.42%</text>
              <text x="20" y="105" fill="#10b981" fontSize="20">↑ +2.3%</text>
              {/* Donut chart segment */}
              <circle cx="380" cy="65" r="35" fill="none" stroke="#27272a" strokeWidth="12"/>
              <circle cx="380" cy="65" r="35" fill="none" stroke="#ec4899" strokeWidth="12" 
                      strokeDasharray="73.3 219.9" transform="rotate(-90 380 65)"/>
              <text x="380" y="73" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">33%</text>
            </g>
            
            {/* Response Time */}
            <g transform="translate(0, 480)">
              <rect width="470" height="130" fill="#18181b" stroke="#10b981" strokeWidth="3" rx="12"/>
              <text x="20" y="35" fill="#4ade80" fontSize="18">Avg Response Time</text>
              <text x="20" y="75" fill="#ffffff" fontSize="42" fontWeight="bold">124ms</text>
              <text x="20" y="105" fill="#10b981" fontSize="20">↓ -18ms</text>
              {/* Speed gauge */}
              <g transform="translate(380, 65)">
                <circle r="40" fill="none" stroke="#27272a" strokeWidth="8"/>
                <circle r="40" fill="none" stroke="#10b981" strokeWidth="8" 
                        strokeDasharray="150.8 100.5" transform="rotate(-90)"/>
                <path d="M 0 -35 L 0 -5" stroke="#10b981" strokeWidth="4" strokeLinecap="round" transform="rotate(45)"/>
              </g>
            </g>
          </g>
        </g>
        
        {/* Floating data visualization elements */}
        <g transform="translate(100, 50)">
          <text x="0" y="0" fill="#8b5cf6" fontSize="48" opacity="0.3" fontWeight="bold">📊</text>
          <text x="1700" y="950" fill="#ec4899" fontSize="48" opacity="0.3" fontWeight="bold">📈</text>
          <text x="50" y="950" fill="#06b6d4" fontSize="42" opacity="0.3" fontWeight="bold">💹</text>
        </g>
      </svg>
    )
  },
  {
    id: 4,
    title: "Mobil Uygulama Geliştirme",
    svg: (
      <svg viewBox="0 0 1920 1080" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mobileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 0.9 }} />
          </linearGradient>
          <filter id="mobileGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="mobileGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1f2937" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        
        {/* Background */}
        <rect width="1920" height="1080" fill="url(#mobileGrid)"/>
        
        {/* Main smartphone - iOS style */}
        <g transform="translate(720, 140)">
          <rect x="0" y="0" width="480" height="920" fill="#18181b" stroke="url(#mobileGrad)" strokeWidth="6" rx="60" filter="url(#mobileGlow)"/>
          <rect x="20" y="50" width="440" height="820" fill="#000000" stroke="#27272a" strokeWidth="2" rx="45"/>
          
          {/* Dynamic Island */}
          <rect x="180" y="60" width="120" height="32" fill="#1a1a1a" rx="16"/>
          <circle cx="220" cy="76" r="4" fill="#10b981">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          {/* Status bar */}
          <text x="40" y="85" fill="#ffffff" fontSize="20" fontWeight="bold">9:41</text>
          <g transform="translate(400, 70)">
            <rect width="18" height="10" fill="none" stroke="#ffffff" strokeWidth="2" rx="2"/>
            <rect width="4" height="6" x="20" y="2" fill="#ffffff" rx="1"/>
          </g>
          <text x="350" y="85" fill="#ffffff" fontSize="18">5G</text>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={380 + i * 6} y={72 + (3 - i) * 3} width="4" height={4 + i * 3} fill="#ffffff"/>
          ))}
          
          {/* App screen content */}
          <g transform="translate(40, 120)">
            {/* App icons grid */}
            {[0, 1, 2, 3].map((row) => (
              <g key={row} transform={`translate(0, ${row * 110})`}>
                {[0, 1, 2, 3].map((col) => {
                  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];
                  const icons = ['<>', '{ }', '[ ]', '()', 'AI', 'DB', 'API', 'UI'];
                  return (
                    <g key={col} transform={`translate(${col * 110}, 0)`}>
                      <rect width="90" height="90" fill={colors[(row * 4 + col) % 8]} rx="20" filter="url(#mobileGlow)">
                        <animate attributeName="opacity" values="1;0.7;1" dur={`${2 + (row + col) * 0.2}s`} repeatCount="indefinite"/>
                      </rect>
                      <text x="45" y="55" fill="#ffffff" fontSize="28" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {icons[(row * 4 + col) % 8]}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
            
            {/* Dock */}
            <g transform="translate(0, 500)">
              <rect x="-10" y="0" width="460" height="120" fill="#1a1a1a" opacity="0.8" rx="30"/>
              {[0, 1, 2, 3].map((i) => {
                const colors = ['#3b82f6', '#10b981', '#ec4899', '#f59e0b'];
                return (
                  <g key={i} transform={`translate(${25 + i * 110}, 15)`}>
                    <rect width="90" height="90" fill={colors[i]} rx="20" filter="url(#mobileGlow)"/>
                    <circle cx="70" cy="20" r="12" fill="#ef4444">
                      <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <text x="68" y="25" fill="#ffffff" fontSize="10" fontWeight="bold">5</text>
                  </g>
                );
              })}
            </g>
          </g>
          
          {/* Home indicator */}
          <rect x="190" y="880" width="100" height="8" fill="#71717a" rx="4"/>
        </g>
        
        {/* Android phone */}
        <g transform="translate(320, 240)">
          <rect x="0" y="0" width="380" height="720" fill="#18181b" stroke="#10b981" strokeWidth="5" rx="40" filter="url(#mobileGlow)"/>
          <rect x="15" y="40" width="350" height="640" fill="#000000" rx="30"/>
          
          {/* Status bar */}
          <text x="30" y="30" fill="#10b981" fontSize="16" fontWeight="bold">ANDROID</text>
          
          {/* Navigation buttons */}
          <g transform="translate(0, 690)">
            <circle cx="100" cy="0" r="8" fill="#71717a"/>
            <circle cx="190" cy="0" r="8" fill="#71717a"/>
            <rect x="265" y="-8" width="30" height="16" fill="#71717a" rx="8"/>
          </g>
          
          {/* App preview */}
          <g transform="translate(30, 70)">
            <rect width="320" height="540" fill="#09090b" rx="20"/>
            <text x="160" y="40" fill="#10b981" fontSize="24" fontWeight="bold" textAnchor="middle">Native App</text>
            {/* Code preview */}
            <text x="20" y="80" fill="#22d3ee" fontSize="14" fontFamily="monospace">import React from 'react';</text>
            <text x="20" y="105" fill="#a78bfa" fontSize="14" fontFamily="monospace">const App = () =&gt; {"{"}</text>
            <text x="40" y="130" fill="#ffffff" fontSize="14" fontFamily="monospace">return (</text>
            <text x="60" y="155" fill="#10b981" fontSize="14" fontFamily="monospace">&lt;View&gt;</text>
            <text x="80" y="180" fill="#f59e0b" fontSize="14" fontFamily="monospace">&lt;Text&gt;Hello&lt;/Text&gt;</text>
            <text x="60" y="205" fill="#10b981" fontSize="14" fontFamily="monospace">&lt;/View&gt;</text>
            <text x="40" y="230" fill="#ffffff" fontSize="14" fontFamily="monospace">);</text>
            <text x="20" y="255" fill="#a78bfa" fontSize="14" fontFamily="monospace">{"}"}</text>
          </g>
        </g>
        
        {/* Tablet */}
        <g transform="translate(1280, 280)">
          <rect x="0" y="0" width="520" height="680" fill="#18181b" stroke="#06b6d4" strokeWidth="5" rx="45" filter="url(#mobileGlow)"/>
          <rect x="15" y="60" width="490" height="560" fill="#000000" rx="30"/>
          
          {/* Camera */}
          <circle cx="260" cy="30" r="8" fill="#1a1a1a" stroke="#06b6d4" strokeWidth="2"/>
          
          {/* Tablet UI - Split screen */}
          <g transform="translate(25, 75)">
            {/* Left panel */}
            <rect width="230" height="530" fill="#09090b" stroke="#06b6d4" strokeWidth="2" rx="12"/>
            <text x="115" y="30" fill="#22d3ee" fontSize="18" fontWeight="bold" textAnchor="middle">Design</text>
            {/* Design elements */}
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x="20" y={60 + i * 110} width="190" height="90" fill="#164e63" stroke="#22d3ee" strokeWidth="2" rx="8">
                <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`}/>
              </rect>
            ))}
            
            {/* Right panel */}
            <rect x="250" y="0" width="230" height="530" fill="#09090b" stroke="#06b6d4" strokeWidth="2" rx="12"/>
            <text x="365" y="30" fill="#22d3ee" fontSize="18" fontWeight="bold" textAnchor="middle">Code</text>
            {/* Code lines */}
            {[177, 159, 138, 182, 165, 189, 145, 172, 158, 191, 148, 185, 134, 176, 167].map((width, i) => (
              <rect key={i} x="270" y={60 + i * 30} width={width} height="4" fill="#06b6d4" opacity="0.5" rx="2"/>
            ))}
          </g>
          
          {/* Home button */}
          <circle cx="260" cy="650" r="12" fill="#1a1a1a" stroke="#06b6d4" strokeWidth="2"/>
        </g>
        
        {/* Floating icons and badges */}
        <g>
          <text x="150" y="200" fill="#10b981" fontSize="54" opacity="0.3">📱</text>
          <text x="1750" y="250" fill="#06b6d4" fontSize="48" opacity="0.3">💻</text>
          <text x="200" y="950" fill="#8b5cf6" fontSize="42" opacity="0.3">⚡</text>
          <text x="1700" y="900" fill="#10b981" fontSize="50" opacity="0.3">🚀</text>
        </g>
        
        {/* Platform badges */}
        <g transform="translate(100, 80)">
          <rect width="180" height="60" fill="#18181b" stroke="#3b82f6" strokeWidth="2" rx="12"/>
          <text x="90" y="40" fill="#60a5fa" fontSize="24" fontWeight="bold" textAnchor="middle">iOS</text>
        </g>
        <g transform="translate(1640, 80)">
          <rect width="180" height="60" fill="#18181b" stroke="#10b981" strokeWidth="2" rx="12"/>
          <text x="90" y="40" fill="#4ade80" fontSize="24" fontWeight="bold" textAnchor="middle">Android</text>
        </g>
      </svg>
    )
  },
  {
    id: 5,
    title: "Güvenlik & Şifreleme",
    svg: (
      <svg viewBox="0 0 1920 1080" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="securityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#ef4444", stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 0.9 }} />
          </linearGradient>
          <linearGradient id="lockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="securityGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="binaryPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <text x="0" y="15" fill="#27272a" fontSize="12" fontFamily="monospace" opacity="0.3">1</text>
          </pattern>
        </defs>
        
        {/* Background binary pattern */}
        <rect width="1920" height="1080" fill="url(#binaryPattern)"/>
        
        {/* Main shield structure */}
        <g transform="translate(760, 200)">
          <path d="M 200 0 L 100 60 L 100 280 Q 100 460, 200 560 Q 300 460, 300 280 L 300 60 Z" 
                fill="#18181b" stroke="url(#securityGrad)" strokeWidth="8" filter="url(#securityGlow)"/>
          
          {/* Shield inner glow */}
          <path d="M 200 20 L 120 70 L 120 280 Q 120 440, 200 530 Q 280 440, 280 280 L 280 70 Z" 
                fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.3"/>
          
          {/* Large lock icon */}
          <g transform="translate(120, 220)">
            <rect x="0" y="50" width="160" height="180" fill="url(#lockGrad)" stroke="#fbbf24" strokeWidth="4" rx="20" filter="url(#securityGlow)"/>
            <path d="M 30 50 L 30 0 Q 30 -50, 80 -50 Q 130 -50, 130 0 L 130 50" 
                  fill="none" stroke="url(#lockGrad)" strokeWidth="12" strokeLinecap="round"/>
            <circle cx="80" cy="130" r="20" fill="#18181b">
              <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite"/>
            </circle>
            <rect x="70" y="140" width="20" height="50" fill="#18181b" rx="4"/>
          </g>
          
          {/* Checkmark */}
          <path d="M 140 120 L 175 155 L 260 70" fill="none" stroke="#10b981" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" filter="url(#securityGlow)">
            <animate attributeName="stroke-dasharray" values="0,300;300,0" dur="3s" repeatCount="indefinite"/>
          </path>
          
          {/* Security waves */}
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx="200" cy="280" r="100" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.2">
              <animate attributeName="r" values={`${100 + i * 40};${180 + i * 40};${100 + i * 40}`} dur="4s" repeatCount="indefinite" begin={`${i * 0.5}s`}/>
              <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" begin={`${i * 0.5}s`}/>
            </circle>
          ))}
        </g>
        
        {/* Encryption process visualization */}
        <g transform="translate(200, 300)">
          {/* Input box */}
          <rect width="280" height="180" fill="#18181b" stroke="#52525b" strokeWidth="3" rx="12"/>
          <text x="140" y="30" fill="#71717a" fontSize="20" fontWeight="bold" textAnchor="middle">INPUT DATA</text>
          <text x="140" y="70" fill="#ffffff" fontSize="16" textAnchor="middle" fontFamily="monospace">Hello World!</text>
          <text x="140" y="95" fill="#ffffff" fontSize="16" textAnchor="middle" fontFamily="monospace">Password: ****</text>
          <text x="140" y="120" fill="#ffffff" fontSize="16" textAnchor="middle" fontFamily="monospace">API Key: xyz123</text>
          <circle cx="140" cy="155" r="8" fill="#3b82f6">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Encryption arrows */}
        <defs>
          <marker id="encryptArrow" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
            <polygon points="0,0 12,6 0,12" fill="#f59e0b"/>
          </marker>
        </defs>
        <path d="M 480 390 L 700 390" stroke="#f59e0b" strokeWidth="6" markerEnd="url(#encryptArrow)" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="15" dur="1s" repeatCount="indefinite"/>
        </path>
        
        {/* Encryption box */}
        <g transform="translate(200, 550)">
          <rect width="280" height="180" fill="#18181b" stroke="#f59e0b" strokeWidth="3" rx="12" filter="url(#securityGlow)"/>
          <text x="140" y="30" fill="#fbbf24" fontSize="20" fontWeight="bold" textAnchor="middle">ENCRYPTION</text>
          <text x="140" y="65" fill="#71717a" fontSize="14" textAnchor="middle">AES-256</text>
          <text x="140" y="90" fill="#71717a" fontSize="14" textAnchor="middle">RSA-2048</text>
          <text x="140" y="115" fill="#71717a" fontSize="14" textAnchor="middle">SHA-512</text>
          {/* Processing animation */}
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={40 + i * 50} y="135" width="30" height="30" fill="#f59e0b" opacity="0.3" rx="4">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.2}s`}/>
              </rect>
            ))}
          </g>
        </g>
        
        <path d="M 480 640 L 700 640" stroke="#10b981" strokeWidth="6" markerEnd="url(#encryptArrow)" strokeDasharray="10,5">
          <animate attributeName="stroke-dashoffset" from="0" to="15" dur="1s" repeatCount="indefinite"/>
        </path>
        
        {/* Output box */}
        <g transform="translate(1440, 300)">
          <rect width="280" height="180" fill="#18181b" stroke="#10b981" strokeWidth="3" rx="12"/>
          <text x="140" y="30" fill="#4ade80" fontSize="20" fontWeight="bold" textAnchor="middle">ENCRYPTED</text>
          {['110101010011101101011010', '001011101100010111010101', '101110100101110010111010', '010111010110101101010011', '110010101101101010111001', '101010110011101101001110'].map((binary, i) => (
            <text key={i} x="140" y={65 + i * 18} fill="#10b981" fontSize="12" textAnchor="middle" fontFamily="monospace">
              {binary}
            </text>
          ))}
          <circle cx="140" cy="155" r="8" fill="#10b981">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Security features panel */}
        <g transform="translate(1440, 550)">
          <rect width="280" height="180" fill="#18181b" stroke="#52525b" strokeWidth="3" rx="12"/>
          <text x="140" y="30" fill="#71717a" fontSize="18" fontWeight="bold" textAnchor="middle">SECURITY FEATURES</text>
          
          <g transform="translate(20, 50)">
            {[
              { icon: '🔐', text: 'End-to-End Encryption' },
              { icon: '🛡️', text: 'DDoS Protection' },
              { icon: '🔑', text: 'Multi-Factor Auth' },
              { icon: '🚨', text: 'Threat Detection' }
            ].map((item, i) => (
              <g key={i} transform={`translate(0, ${i * 30})`}>
                <text x="0" y="15" fontSize="20">{item.icon}</text>
                <text x="40" y="15" fill="#ffffff" fontSize="14">{item.text}</text>
                <circle cx="230" cy="10" r="5" fill="#10b981">
                  <animate attributeName="opacity" values="1;0.3;1" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite"/>
                </circle>
              </g>
            ))}
          </g>
        </g>
        
        {/* Binary data stream */}
        <g>
          {['1010', '0101', '1010', '0101', '1010', '0101', '1010', '0101', '1010', '0101', 
            '0101', '1010', '0101', '1010', '0101', '1010', '0101', '1010', '0101', '1010',
            '1010', '0101', '1010', '0101', '1010', '0101', '1010', '0101', '1010', '0101'].map((binary, i) => (
            <text key={i} x={100 + (i * 60) % 1720} y={100 + Math.floor(i / 30) * 880} 
                  fill="#27272a" fontSize="16" fontFamily="monospace" opacity="0.4">
              {binary}
            </text>
          ))}
        </g>
        
        {/* Status indicators */}
        <g transform="translate(760, 850)">
          <rect width="400" height="80" fill="#18181b" stroke="#10b981" strokeWidth="3" rx="12" filter="url(#securityGlow)"/>
          <text x="200" y="35" fill="#10b981" fontSize="24" fontWeight="bold" textAnchor="middle">● SECURE CONNECTION</text>
          <text x="200" y="60" fill="#4ade80" fontSize="16" textAnchor="middle">TLS 1.3 | 256-bit Encryption</text>
        </g>
        
        {/* Floating icons */}
        <text x="100" y="150" fill="#ef4444" fontSize="54" opacity="0.3">🔒</text>
        <text x="1750" y="200" fill="#f59e0b" fontSize="48" opacity="0.3">🔑</text>
        <text x="150" y="950" fill="#10b981" fontSize="50" opacity="0.3">✓</text>
        <text x="1700" y="900" fill="#fbbf24" fontSize="46" opacity="0.3">🛡️</text>
      </svg>
    )
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
              ? "opacity-0 -translate-x-full"
              : "opacity-0 translate-x-full"
          }`}
        >
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
              {slide.svg}
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-zinc-600 hover:bg-zinc-400"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-zinc-900 border border-zinc-700 px-6 py-2 rounded">
          <p className="text-zinc-300 text-sm font-medium">{slides[currentSlide].title}</p>
        </div>
      </div>
    </div>
  );
}
