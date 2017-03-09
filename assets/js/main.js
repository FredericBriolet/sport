'use strict';

/**
 * Globals params
 */
var landing_id = 'svg-landing';
var timeLine_id = '#section-timeline';
var svg_sprite_path = 'assets/img/symbol.svg#';
//Run Js
window.onload = init;


/**
 * function init
 *
 */
function init() {
    console.log('init');
    initLanding(landing_id);
    var timeline = initTimeline(timeLine_id);
}

function initTimeline(el) {
    var article = {
        props: {
            article: Object,
            index: Number
        },
        computed: {
            switchPosition: function () {
                console.log('sc')
                var self = this;
                return self.index % 2 === 0 ? 'article-right' : 'article-left';
            },
            iconCategoryPath: function () {
                var self = this;
                var path = false;
                switch (self.article.category.name) {
                    case 'Connected Sports Gear':
                        path = svg_sprite_path + 'connected';
                        break;
                    case 'VR':
                        path = svg_sprite_path + 'vr';
                        break;
                    case 'Interactive Experiences':
                        path = svg_sprite_path + 'interactive';
                        break;
                    case 'E-Sport':
                        path = svg_sprite_path + 'esport';
                        break;
                    case 'App':
                        path = svg_sprite_path + 'mobile';
                        break;
                    default:
                        break;
                }
                return path;
            }
        },
        beforeMount: function () {
            var self = this;
            console.log('before-mount');
            if (this.index === 0) {
                self.$parent.$data.dates[self.article.date.month.name] = [];
                console.log(self.article.date.month.name)
            }
            // self.$parent.$data.dates[self.article.month.name]
        },
        template: '' +
        '<article class="timeline-article" :class="this.switchPosition">' +
        '<div class="article-date"><span class="date">{{ article.date.day }}<sup>th</sup></span></div>' +
        '<div class="article-img-container">' +
        '<img v-if="article.medias.image" class="article-image" :src="this.article.medias.image" :alt="this.article.title">' +
        '</div>' +
        '<div class="article-content">' +
        '<main>' +
        '<header class="article-header" >' +
        '<svg v-if="this.iconCategoryPath" class="icon article-category"><use :xlink:href="this.iconCategoryPath"/></svg>' +
        '<h2 class="article-title" v-html="this.article.title"></h2>' +
        '</header>' +
        '<section class="article-body">' +
        '<p class="article-desc" v-html="this.article.description"></p>' +
        '</section>' +
        '<footer>' +
        '<div class="article-links">' +
        '<a :href="this.article.url" target="_blank" rel="nofollow" class="article-link">Read the article</a>' +
        '<a v-if="article.medias.video" :href="this.article.medias.video" class="article-link">See the video</a>' +
        '</div>' +
        '</footer>' +
        '</main>' +
        '<aside class="articles-more">' +
        '<ul class="article-tags">' +
        '<li class="article-tag" v-for="tag in article.hashtag">{{ tag }}</li>' +
        '</ul>' +
        '</aside>' +
        '</div>' +
        '</article>'
    };

    return new Vue({
        el: el,
        data: {
            articles: TIMELINE,
            dates: {}
        },
        components: {
            'article-component': article
        }
    });

}

/**
 * function init Landing
 */
function initLanding(id) {
    var opts = {
        duration: 50,
        file: '/assets/svg/landing.svg',
        type: 'scenario',
        animTimingFunction: Vivus.EASE,
        reverseStack: true
    };
    var landing = new Vivus(id, opts);
    landing.play(2);
}

