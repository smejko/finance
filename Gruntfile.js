module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-exec');

	grunt.initConfig({
		exec: {
			bootstrap:	{ 
				cmd: 'mkdir -p public/bootstrap && cp -ru node_modules/bootstrap/dist/* -t public/bootstrap',
			},
			message: {
				cmd: 'echo "No default set yet!"'
			}
		}
	});

	grunt.registerTask('default', ['exec:message']);
};
