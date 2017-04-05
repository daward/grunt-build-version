'use strict';

module.exports = function (grunt) {

  /**
   * tacks on the build number as the patch value
   * @param {any} semver - the semantic version to manipulate 
   */ 
  var setPatch = function (semver) {
    var lastDot = semver.lastIndexOf(".");
    return semver.substr(0, lastDot) + "." + grunt.option("build");
  };

  /**
   * sets the version number in the package.json file
   */
  var setVersion = function () {
    grunt.file.copy("./package.json", "./package.json.bak");
    var packageJson = grunt.file.readJSON("./package.json");
    
    packageJson.version = setPatch(packageJson.version);
    grunt.file.write("./package.json", JSON.stringify(packageJson, null, 2));
    grunt.log.writeln("Package written with version " + packageJson.version + "\n");
    cleanUp();
  };

  /**
   * Ensures a backup file of the json does not exist
   */
  var cleanUp = function () {
    try {
      if (grunt.file.exists("./package.json.bak")) {
        grunt.file.copy("./package.json.bak", "./package.json");
      }
      grunt.file.delete("./package.json.bak");
    } catch (ex) {
      grunt.log.error(ex);
    }
    grunt.log.writeln("\nPackage cleanup complete");
  };

  // register the set version task
  grunt.registerTask('set_version', 'Sets the version number to the current build number.', function () {

    // get a build number as passed in, or from an environment variable
    if (!grunt.option("build")) {
      grunt.option("build", process.env.BUILD_NUMBER);
    }

    grunt.log.writeln(grunt.option("build"));

    // set the build number to the package.json
    setVersion();
  });
};

