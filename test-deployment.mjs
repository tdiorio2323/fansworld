#!/usr/bin/env node
/**
 * CABANA Deployment Test Suite
 * Tests the live Vercel deployment for functionality
 */

const BASE_URL = 'https://cabanagrp.com';

// Core routes to test
const ROUTES_TO_TEST = [
  '/',
  '/about',
  '/features', 
  '/pricing',
  '/discover',
  '/signin',
  '/register',
  '/vip',
  '/test',
  '/help',
  '/terms'
];

async function testRoute(route) {
  try {
    const response = await fetch(BASE_URL + route);
    const status = response.status;
    const isSuccess = status >= 200 && status < 400;
    
    console.log(`${isSuccess ? '✅' : '❌'} ${status} ${route}`);
    return { route, status, success: isSuccess };
  } catch (error) {
    console.log(`❌ ERR ${route} - ${error.message}`);
    return { route, status: 'ERROR', success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing CABANA Deployment...');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('─'.repeat(50));
  
  const results = [];
  
  for (const route of ROUTES_TO_TEST) {
    const result = await testRoute(route);
    results.push(result);
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('─'.repeat(50));
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`📊 Results: ${successful}/${total} routes working`);
  
  if (successful === total) {
    console.log('🎉 All tests passed! CABANA deployment is fully functional!');
  } else {
    console.log('⚠️  Some routes failed. Check the logs above.');
  }
  
  return results;
}

// Run the tests
runTests().catch(console.error);