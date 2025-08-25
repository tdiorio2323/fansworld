#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

/**
 * Route Audit Script for Cabana
 * Analyzes React Router routes for 404s and missing pages
 */

class RouteAuditor {
    constructor() {
        this.routes = [];
        this.links = [];
        this.results = {
            routerType: 'React Router v6 + Vite',
            routes: [],
            orphanLinks: [],
            missingFiles: [],
            httpStatus: {},
            summary: {}
        };
    }

    /**
     * Extract routes from AppRoutes.tsx
     */
    async extractRoutes() {
        console.log('📍 Extracting routes from AppRoutes.tsx...');

        try {
            const appRoutesPath = path.join(projectRoot, 'src/routes/AppRoutes.tsx');
            const content = await fs.readFile(appRoutesPath, 'utf-8');

            // Extract route paths using regex
            const routeMatches = content.match(/<Route\s+path="([^"]+)"/g) || [];
            const indexRoutes = content.match(/<Route\s+index\s+element/g) || [];

            const extractedRoutes = new Set();

            // Add index routes
            if (indexRoutes.length > 0) {
                extractedRoutes.add('/');
            }

            // Process path routes
            routeMatches.forEach(match => {
                const pathMatch = match.match(/path="([^"]+)"/);
                if (pathMatch) {
                    let routePath = pathMatch[1];

                    // Handle relative paths by converting to absolute
                    if (!routePath.startsWith('/')) {
                        routePath = '/' + routePath;
                    }

                    // Handle dynamic segments
                    routePath = routePath.replace(/:(\w+)/g, '[param]');

                    extractedRoutes.add(routePath);
                }
            });

            // Build nested routes by analyzing the structure
            const nestedRoutes = this.buildNestedRoutes(content);
            nestedRoutes.forEach(route => extractedRoutes.add(route));

            this.routes = Array.from(extractedRoutes).sort();
            console.log(`✅ Found ${this.routes.length} routes`);

            return this.routes;
        } catch (error) {
            console.error('❌ Error extracting routes:', error.message);
            return [];
        }
    }

    /**
     * Build nested routes from the route structure
     */
    buildNestedRoutes(content) {
        const nestedRoutes = [];

        // Common route patterns based on the AppRoutes structure
        const routePatterns = [
            // Auth routes
            '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password',
            '/auth/verify-email', '/auth/two-factor', '/auth/callback/[param]',

            // Creator routes
            '/creator', '/creator/dashboard', '/creator/analytics', '/creator/analytics/[param]',
            '/creator/earnings', '/creator/earnings/history', '/creator/earnings/taxes',
            '/creator/content', '/creator/content/new', '/creator/content/edit/[param]',
            '/creator/content/scheduler', '/creator/fans', '/creator/fans/analytics',
            '/creator/fans/tiers', '/creator/messaging', '/creator/messaging/[param]',
            '/creator/settings', '/creator/settings/[param]', '/creator/tools',
            '/creator/tools/[param]',

            // User routes
            '/user/profile', '/user/profile/edit', '/user/settings', '/user/subscriptions',
            '/user/favorites', '/user/history', '/user/notifications',

            // Admin routes
            '/admin', '/admin/dashboard', '/admin/users', '/admin/users/[param]',
            '/admin/creators', '/admin/creators/[param]', '/admin/content',
            '/admin/content/moderation', '/admin/payments', '/admin/payments/disputes',
            '/admin/analytics', '/admin/reports', '/admin/settings', '/admin/system',

            // Forum routes
            '/forum', '/forum/categories', '/forum/categories/[param]',
            '/forum/topics/[param]', '/forum/topics/new', '/forum/search',
            '/forum/moderation',

            // Community routes
            '/community', '/community/groups', '/community/groups/[param]',
            '/community/events', '/community/events/[param]', '/community/challenges',
            '/community/challenges/[param]', '/community/leaderboards',
            '/community/achievements',

            // Legal routes
            '/legal/terms', '/legal/privacy', '/legal/dmca', '/legal/compliance',
            '/legal/cookies',

            // Support routes
            '/support', '/support/help', '/support/help/[param]',
            '/support/help/articles/[param]', '/support/faq', '/support/contact',
            '/support/tickets', '/support/tickets/[param]', '/support/tickets/new',
            '/support/guides', '/support/guides/[param]', '/support/tutorials',
            '/support/tutorials/[param]', '/support/troubleshooting',

            // Marketing routes
            '/marketing/landing/[param]', '/marketing/campaigns', '/marketing/referrals',
            '/marketing/affiliates', '/marketing/partnerships', '/marketing/promotions',

            // Campaign routes
            '/campaigns/seasonal/[param]', '/campaigns/events/[param]',
            '/campaigns/partnerships/[param]',

            // Analytics routes
            '/analytics/tracking', '/analytics/reports', '/analytics/insights',

            // Mobile routes
            '/mobile/app', '/mobile/responsive',

            // SEO routes
            '/sitemap.xml', '/robots.txt',

            // Error routes
            '/error/403', '/error/500', '/error/maintenance', '/error/offline',

            // Public routes
            '/about', '/features', '/pricing', '/blog', '/contact', '/careers',
            '/press', '/investors', '/discover', '/categories', '/creator/[param]'
        ];

        return routePatterns;
    }

    /**
     * Find all href links in the codebase
     */
    async findLinks() {
        console.log('🔗 Finding all href links in codebase...');

        try {
            // Search for href attributes in various file types
            const { stdout: hrefResults } = await execAsync(
                `grep -r "href=" --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" src/ app/ || true`,
                { cwd: projectRoot }
            );

            // Search for Link components
            const { stdout: linkResults } = await execAsync(
                `grep -r "to=" --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" src/ app/ || true`,
                { cwd: projectRoot }
            );

            // Search for navigate calls
            const { stdout: navigateResults } = await execAsync(
                `grep -r "navigate(" --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" src/ app/ || true`,
                { cwd: projectRoot }
            );

            const allResults = [hrefResults, linkResults, navigateResults].join('\n');
            const lines = allResults.split('\n').filter(line => line.trim());

            const linkSet = new Set();

            lines.forEach(line => {
                // Extract href values
                const hrefMatches = line.match(/href=["']([^"']+)["']/g) || [];
                const toMatches = line.match(/to=["']([^"']+)["']/g) || [];
                const navigateMatches = line.match(/navigate\(["']([^"']+)["']\)/g) || [];

                [...hrefMatches, ...toMatches, ...navigateMatches].forEach(match => {
                    let url = match.match(/["']([^"']+)["']/)?.[1];
                    if (url && url.startsWith('/') && !url.startsWith('//')) {
                        // Clean up the URL
                        url = url.split('?')[0].split('#')[0]; // Remove query params and fragments
                        linkSet.add(url);
                    }
                });
            });

            this.links = Array.from(linkSet).sort();
            console.log(`✅ Found ${this.links.length} internal links`);

            return this.links;
        } catch (error) {
            console.error('❌ Error finding links:', error.message);
            return [];
        }
    }

    /**
     * Check if page files exist for routes
     */
    async checkPageFiles() {
        console.log('📁 Checking for page files...');

        const missingFiles = [];

        for (const route of this.routes) {
            if (route === '*' || route.includes('[param]')) continue;

            // Try to find corresponding page file
            const possiblePaths = this.generatePossiblePagePaths(route);
            let fileExists = false;

            for (const filePath of possiblePaths) {
                try {
                    await fs.access(path.join(projectRoot, filePath));
                    fileExists = true;
                    break;
                } catch {
                    // File doesn't exist, continue checking
                }
            }

            if (!fileExists) {
                missingFiles.push({
                    route,
                    expectedPaths: possiblePaths
                });
            }
        }

        this.results.missingFiles = missingFiles;
        console.log(`⚠️  Found ${missingFiles.length} routes with missing files`);

        return missingFiles;
    }

    /**
     * Generate possible page file paths for a route
     */
    generatePossiblePagePaths(route) {
        const paths = [];

        if (route === '/') {
            paths.push('src/pages/HomePage.tsx', 'src/pages/HomePage.jsx');
            return paths;
        }

        // Convert route to potential file paths
        const routeParts = route.split('/').filter(part => part);
        const fileName = routeParts[routeParts.length - 1];

        // Capitalize first letter for component names
        const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

        // Generate various possible paths
        paths.push(
            `src/pages/${routeParts.join('/')}/${componentName}Page.tsx`,
            `src/pages/${routeParts.join('/')}/${componentName}Page.jsx`,
            `src/pages/${routeParts.join('/')}/${componentName}.tsx`,
            `src/pages/${routeParts.join('/')}/${componentName}.jsx`,
            `src/pages/${routeParts.join('/')}/index.tsx`,
            `src/pages/${routeParts.join('/')}/index.jsx`
        );

        return paths;
    }

    /**
     * Start development server and check HTTP status
     */
    async checkHttpStatus() {
        console.log('🌐 Starting development server and checking HTTP status...');

        try {
            // Check if server is already running
            let serverRunning = false;
            try {
                const { stdout } = await execAsync('lsof -i :3004');
                if (stdout.trim()) {
                    serverRunning = true;
                    console.log('✅ Development server already running on port 3004');
                }
            } catch {
                // Server not running
            }

            let serverProcess = null;

            if (!serverRunning) {
                console.log('🚀 Starting development server on port 3004...');

                // Start server in background
                serverProcess = exec('PORT=3004 npm run dev:vite', { cwd: projectRoot });

                // Wait for server to be ready
                await this.waitForServer('http://localhost:3004', 60000);
            }

            // Test routes
            const statusResults = {};
            const testRoutes = [...new Set([...this.routes, ...this.links])];

            console.log(`🧪 Testing ${testRoutes.length} routes...`);

            for (const route of testRoutes) {
                if (route === '*' || route.includes('[param]')) continue;

                try {
                    const url = `http://localhost:3004${route}`;
                    const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" "${url}"`);
                    const statusCode = parseInt(stdout.trim());

                    statusResults[route] = {
                        status: statusCode,
                        ok: statusCode >= 200 && statusCode < 400
                    };

                    if (statusCode !== 200) {
                        console.log(`⚠️  ${route}: ${statusCode}`);
                    }
                } catch (error) {
                    statusResults[route] = {
                        status: 'ERROR',
                        ok: false,
                        error: error.message
                    };
                    console.log(`❌ ${route}: ERROR`);
                }
            }

            this.results.httpStatus = statusResults;

            // Clean up server if we started it
            if (serverProcess && !serverRunning) {
                console.log('🛑 Stopping development server...');
                serverProcess.kill();
            }

            return statusResults;
        } catch (error) {
            console.error('❌ Error checking HTTP status:', error.message);
            return {};
        }
    }

    /**
     * Wait for server to be ready
     */
    async waitForServer(url, timeout = 60000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            try {
                await execAsync(`curl -s -o /dev/null "${url}"`);
                console.log('✅ Server is ready');
                return true;
            } catch {
                console.log('⏳ Waiting for server...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        throw new Error('Server failed to start within timeout');
    }

    /**
     * Analyze results and generate report data
     */
    analyzeResults() {
        console.log('📊 Analyzing results...');

        // Find orphan links (links that don't have matching routes)
        const routeSet = new Set(this.routes);
        const orphanLinks = this.links.filter(link => {
            // Check if link matches any route (considering dynamic segments)
            return !this.routes.some(route => {
                if (route === link) return true;

                // Check dynamic routes
                const routePattern = route.replace(/\[param\]/g, '[^/]+');
                const regex = new RegExp(`^${routePattern}$`);
                return regex.test(link);
            });
        });

        this.results.orphanLinks = orphanLinks;

        // Build route table
        this.results.routes = this.routes.map(route => {
            const httpResult = this.results.httpStatus[route];
            const linksToRoute = this.links.filter(link => {
                if (link === route) return true;

                // Check if link matches dynamic route
                const routePattern = route.replace(/\[param\]/g, '[^/]+');
                const regex = new RegExp(`^${routePattern}$`);
                return regex.test(link);
            });

            return {
                route,
                file: this.findPageFileForRoute(route),
                linkSources: linksToRoute,
                httpStatus: httpResult?.status || 'NOT_TESTED',
                ok: httpResult?.ok || false
            };
        });

        // Generate summary
        const totalRoutes = this.routes.length;
        const workingRoutes = Object.values(this.results.httpStatus).filter(r => r.ok).length;
        const brokenRoutes = Object.values(this.results.httpStatus).filter(r => !r.ok).length;

        this.results.summary = {
            totalRoutes,
            workingRoutes,
            brokenRoutes,
            orphanLinks: orphanLinks.length,
            missingFiles: this.results.missingFiles.length,
            routerType: this.results.routerType
        };

        console.log('✅ Analysis complete');
    }

    /**
     * Find page file for a route
     */
    findPageFileForRoute(route) {
        // This is a simplified mapping based on the AppRoutes structure
        const routeToFileMap = {
            '/': 'src/pages/HomePage.tsx',
            '/about': 'src/pages/public/AboutPage.tsx',
            '/features': 'src/pages/public/FeaturesPage.tsx',
            '/pricing': 'src/pages/public/PricingPage.tsx',
            '/blog': 'src/pages/public/BlogPage.tsx',
            '/contact': 'src/pages/public/ContactPage.tsx',
            '/careers': 'src/pages/public/CareersPage.tsx',
            '/press': 'src/pages/public/PressPage.tsx',
            '/investors': 'src/pages/public/InvestorsPage.tsx',
            '/discover': 'src/pages/DiscoverPage.tsx',
            '/categories': 'src/pages/CategoriesPage.tsx',
            '/creator/[param]': 'src/pages/CreatorProfilePage.tsx',
            '/auth/login': 'src/pages/auth/LoginPage.tsx',
            '/auth/register': 'src/pages/auth/RegisterPage.tsx',
            // Add more mappings as needed
        };

        return routeToFileMap[route] || 'UNKNOWN';
    }

    /**
     * Run the complete audit
     */
    async runAudit() {
        console.log('🔍 Starting Cabana Route Audit...\n');

        try {
            await this.extractRoutes();
            await this.findLinks();
            await this.checkPageFiles();
            await this.checkHttpStatus();
            this.analyzeResults();

            // Save results to JSON
            const outputPath = path.join(projectRoot, 'reports/route_audit.json');
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));

            console.log(`\n✅ Audit complete! Results saved to: ${outputPath}`);
            console.log(`📊 Summary: ${this.results.summary.totalRoutes} routes, ${this.results.summary.brokenRoutes} broken, ${this.results.summary.orphanLinks} orphan links`);

            return this.results;
        } catch (error) {
            console.error('❌ Audit failed:', error.message);
            throw error;
        }
    }
}

// Run the audit if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const auditor = new RouteAuditor();
    auditor.runAudit().catch(console.error);
}

export default RouteAuditor;
