module.exports = function (grunt) {
	grunt.initConfig({
		compress: {
			main: {
			  options: {
				archive: 'syntax-highlighting-code-block-copy-addon.zip'
			  },
			  files: [
				{src: ['syntax-highlighting-code-block-copy-addon.php'], dest: '/', filter: 'isFile'}, // includes files in path
				{src: ['build/**'], dest: '/'}, // includes files in path and its subdirs
			  ]
			}
		  }
	  });
	  grunt.registerTask('default', ["compress"]);

 
 
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
   
 };
