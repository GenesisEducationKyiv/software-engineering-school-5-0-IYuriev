// import { WinstonLogger } from '../../../../../libs/common/logger/logger.service';

// export function LogSubscription() {
//   return function (
//     target: unknown,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     const originalMethod = descriptor.value;
//     descriptor.value = async function (...args: unknown[]) {
//       const logger = new WinstonLogger(target.constructor.name);
//       const startTime = Date.now();

//       try {
//         logger.log(`Calling ${propertyKey}`, { args, method: propertyKey });

//         const result = await originalMethod.apply(this, args);
//         const duration = Date.now() - startTime;

//         logger.log(`Completed ${propertyKey}`, {
//           result,
//           method: propertyKey,
//           duration,
//         });

//         return result;
//       } catch (error) {
//         const duration = Date.now() - startTime;

//         logger.error(`Error in ${propertyKey}`, {
//           args,
//           method: propertyKey,
//           duration,
//           error: error instanceof Error ? error.message : String(error),
//         });

//         throw error;
//       }
//     };
//     return descriptor;
//   };
// }
