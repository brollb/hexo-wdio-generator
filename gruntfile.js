module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: ['build'],
        babel: {
            options: {
                sourceMap: false,
                plugins: ['object-assign'],
                optional: ['runtime']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['index.js', './lib/*.js'],
                    dest: 'build',
                    ext: '.js'
                }]
            }
        },
        mocha_istanbul: {
            coverage: {
                src: ['test/*.spec.js'],
                options: {
                    scriptPath: require.resolve('isparta/bin/isparta'),
                    reporter: 'spec',
                    mochaOptions: ['--compilers', 'js:babel/register', '--recursive'],
                    require: ['should']
                }
            }
        },
        watch: {
            dist: {
                files: ['index.js', './lib/*.js'],
                tasks: ['babel:dist']
            }
        },
        eslint: {
            options: {
                parser: 'babel-eslint'
            },
            target: ['index.js']
        },
        contributors: {
            options: {
                commitMessage: 'update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'v%VERSION%',
                pushTo: 'upstream'
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['build'])
    grunt.registerTask('build', 'Build wdio-hexo-generator', function () {
        grunt.task.run([
            'eslint',
            'clean',
            'babel',
            'mocha_istanbul'
        ])
    })
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })
}
