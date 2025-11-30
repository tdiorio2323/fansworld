// Enable decorator metadata support
import 'reflect-metadata';
import { Container } from './infrastructure/container/Container';

// Initialize the DI container
const container = Container.getInstance();
container.initialize();

export { container };