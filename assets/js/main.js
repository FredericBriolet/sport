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
    var inViewPort = {
        props: {
            inViewportActive: {
                type: Boolean,
                "default": true
            },
            inViewportOnce: {
                type: Boolean,
                "default": false
            },
            inViewportOffset: {
                type: Number,
                "default": 0
            },
            inViewportOffsetTop: {
                type: Number,
                "default": null
            },
            inViewportOffsetBottom: {
                type: Number,
                "default": null
            }
        },
        data: function () {
            return {
                inViewport: {
                    now: null,
                    fully: null,
                    above: null,
                    below: null,
                    listening: false
                }
            };
        },
        computed: {
            inViewportOffsetTopComputed: function () {
                var ref;
                return (ref = this.inViewportOffsetTop) != null ? ref : this.inViewportOffset;
            },
            inViewportOffsetBottomComputed: function () {
                var ref;
                return (ref = this.inViewportOffsetBottom) != null ? ref : this.inViewportOffset;
            },
            inViewportOffsetComputed: function () {
                return {
                    top: this.inViewportOffsetTopComputed,
                    bottom: this.inViewportOffsetBottomComputed
                };
            }
        },
        mounted: function () {
            return this.inViewportInit();
        },
        destroyed: function () {
            return this.removeInViewportHandlers();
        },
        watch: {
            inViewportActive: function (active) {
                if (active) {
                    return this.addInViewportHandlers();
                } else {
                    return this.removeInViewportHandlers();
                }
            },
            inViewportOffsetComputed: {
                deep: true,
                handler: function () {
                    this.removeInViewportHandlers();
                    return this.inViewportInit();
                }
            }
        },
        methods: {
            inViewportInit: function () {
                if (this.inViewportActive) {
                    return this.addInViewportHandlers();
                }
            },
            addInViewportHandlers: function () {
                if (this.inViewport.listening) {
                    return;
                }
                this.inViewport.listening = true;
                this.scrollMonitor = scrollMonitor.create(this.$el, this.inViewportOffsetComputed);
                this.scrollMonitor.on('stateChange', this.updateInViewport);
                return this.updateInViewport();
            },
            removeInViewportHandlers: function () {
                if (!this.inViewport.listening) {
                    return;
                }
                this.inViewport.listening = false;
                if (this.scrollMonitor) {
                    this.scrollMonitor.destroy();
                }
                return delete this.scrollMonitor;
            },
            updateInViewport: function () {
                this.inViewport.now = this.scrollMonitor.isInViewport;
                this.inViewport.fully = this.scrollMonitor.isFullyInViewport;
                this.inViewport.above = this.scrollMonitor.isAboveViewport;
                this.inViewport.below = this.scrollMonitor.isBelowViewport;
                if (this.inViewportOnce && this.inViewport.now) {
                    return this.removeInViewportHandlers();
                }
            }
        }
    };
    var article = {
        props: {
            article: Object,
            index: Number
        },
        data: {
            // visible: false
        },
        mixins: [inViewPort],
        computed: {
            visible: function () {
                var self = this;
                return self.inViewport.now;

            },
            offset: function () {
                return -window.innerHeight + 75
            },
            switchPosition: function () {
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
        template: '' +
        '<article class="timeline-article" :class="this.switchPosition">' +
        '<transition name="transition-article-date">' +
        '<div v-if="visible" class="article-date"><span class="date">{{ article.date.day }}<sup>th</sup></span></div>' +
        '</transition>' +
        '<div class="article-img-container">' +
            '<transition name="transition-article-image-slide">'+
        '<img v-show="article.medias.image && visible" class="article-image" :src="this.article.medias.image" :alt="this.article.title">' +
        '</transition>'+
        '</div>' +
        '<div class="article-content" >' +
        '<transition name="transition-article-content">' +
        '<main v-if="visible" >' +
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
        '</transition>' +
        // '<aside class="articles-more">' +
        // '<ul class="article-tags">' +
        // '<li class="article-tag" v-for="tag in article.hashtag">{{ tag }}</li>' +
        // '</ul>' +
        // '</aside>' +
        '</div>' +
        '</article>'
    };

    return new Vue({
        el: el,
        data: {
            articles: TIMELINE,
            visible: false
        },
        mixins: [inViewPort],
        computed: {
            visibleComputed: function () {
                var self = this;
                console.log('computed')
                return self.inViewport.now;
            }
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

