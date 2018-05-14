import gulp from 'gulp';
import { spawn } from 'child_process';
import hugoBin from 'hugo-bin';
import gutil from 'gulp-util';
import flatten from 'gulp-flatten';
import postcss from 'gulp-postcss';
import cssImport from 'postcss-import';
import cssnext from 'postcss-cssnext';
import sass from 'gulp-sass';
import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import webpackConfig from './webpack.conf';
import svgmin from 'gulp-svgmin';
import path from 'path';
import del from 'del';

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ['-d', '../dist', '-s', 'site', '-v'];
const hugoArgsPreview = ['--buildDrafts', '--buildFuture'];

// Development tasks
gulp.task('hugo', cb => buildSite(cb));
gulp.task('hugo-preview', cb => buildSite(cb, hugoArgsPreview));

// Build/production tasks
gulp.task('build', ['sass', 'js', 'fonts', 'svg'], cb =>
    buildSite(cb, [], 'production')
);
gulp.task('build-preview', ['sass', 'js', 'fonts', 'svg'], cb =>
    buildSite(cb, hugoArgsPreview, 'production')
);

// Compile CSS with PostCSS
gulp.task('css', () =>
    gulp
        .src('./src/css/*.css')
        .pipe(postcss([cssImport({ from: './src/css/main.css' }), cssnext()]))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream())
);

gulp.task('sass', () =>
    gulp
        .src('./src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream())
);

// Compile Javascript
gulp.task('js', cb => {
    const myConfig = Object.assign({}, webpackConfig);

    webpack(myConfig, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log(
            '[webpack]',
            stats.toString({
                colors: true,
                progress: true
            })
        );
        browserSync.reload();
        cb();
    });
});

var svgSrc = './src/svg/**/*.svg';
var svgDest = './site/static/svg';

gulp.task('clean-scripts', function () {
    del([svgDest]);
});

gulp.task('svg', () =>
     gulp
        .src(svgSrc)
        .pipe(svgmin(function getOptions(file) {
            var filename = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                    { removeTitle: true },
                    { removeDoctype: true }, 
                    { removeComments: true },
                    { cleanupNumericValues: { floatPrecision: 2 } },
                    { convertColors: { names2hex: true, rgb2hex: true } },
                    { cleanupIDs: { remove: false, minify: true, prefix: `${filename}-` } }
                ]
            }
        }))
        .pipe(gulp.dest(svgDest))
)

// Move all fonts in a flattened directory
gulp.task('fonts', () =>
    gulp
        .src('./src/fonts/**/*')
        .pipe(flatten())
        .pipe(gulp.dest('./dist/fonts'))
        .pipe(browserSync.stream())
);

// Development server with browsersync
gulp.task('server', ['clean-scripts', 'scripts'], () => {})
gulp.task('scripts', ['svg', 'hugo', 'sass', 'js', 'fonts'], () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    gulp.watch('./src/svg/**/*.svg', ['svg']);
    gulp.watch('./src/fonts/**/*', ['fonts']);
    gulp.watch('./site/**/*', ['hugo']);
});

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = 'development') {
    const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

    process.env.NODE_ENV = environment;

    return spawn(hugoBin, args, { stdio: 'inherit' }).on('close', code => {
        if (code === 0) {
            browserSync.reload();
            cb();
        } else {
            browserSync.notify('Hugo build failed :(');
            cb('Hugo build failed');
        }
    });
}
