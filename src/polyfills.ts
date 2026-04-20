/**
 * Polyfills Entry Point
 *
 * This file must be imported before any code that uses decorators or dependency injection.
 * It ensures reflect-metadata is loaded for tsyringe to work properly.
 */

// Import reflect-metadata for tsyringe dependency injection
// This must be imported before any @injectable decorators are used
import 'reflect-metadata';
