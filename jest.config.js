/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  snapshotSerializers: ['enzyme-to-json/serializer'],
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
};