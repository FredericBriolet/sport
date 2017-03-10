'use strict';

/**
 * Globals params
 */
var landing_id = 'svg-landing';
var app_id = '#app';
var svg_sprite_path = 'assets/img/symbol.svg#';
//Run Js
window.onload = init;


/**
 * function init
 *
 */
function init() {
    initLanding(landing_id);
    var app = initApp(app_id);
    var categories_container = document.getElementById('categories-container');
    var categories_parent_container = document.getElementById('categories-container-parent');
    var follow_pos = window.innerHeight + categories_parent_container.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    var cat_top = categories_container.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
    var section_end = document.getElementById('pos-end');

    window.addEventListener('scroll', function (e) {
        var pos = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        // console.log(pos);
        var end = section_end.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        // if(pos >= cat_top && pos <= follow_pos) {
        //     console.log('ici');
        //     categories_container.classList.add('follow');
        //     categories_container.classList.remove('fixed');
        //     categories_container.style.top = pos +'px';
        // }
        // else
            if(pos >= cat_top && pos <= end) {
            categories_container.classList.add('fixed');
            // categories_container.classList.remove('follow');

        } else {
            categories_container.classList.remove('fixed');
            // categories_container.classList.remove('follow');
        }

    });
}

function initApp(el) {
    //Mixins
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

    //Components
    var articleComponent = {
        props: {
            article: Object,
            index: Number
        },
        data: {
            categoryClass: ''
        },
        mixins: [inViewPort],
        computed: {
            visible: function () {
                var self = this;
                return self.inViewport.now;
            },
            imgTransition: function () {
                var self = this;
                return self.index % 2 === 0 ? 'transition-article-image-slide-right' : 'transition-article-image-slide-left';
            },
            enabledArticle: function () {
                var self = this;
                var parent = self.$parent;
                if (parent.$data.activeCategories.length === 0) {
                    return {opacity: 1};
                }
                if (parent.$data.activeCategories.indexOf(self.article.category.index) > -1) {
                    return {opacity: 1};
                } else {
                    return {opacity: .25, filter: 'blur(20px)'};
                }
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
                        self.categoryClass = "connected";
                        break;
                    case 'VR':
                        self.categoryClass = "vr";
                        break;
                    case 'Interactive Experiences':
                        self.categoryClass = 'interactive';
                        break;
                    case 'E-Sport':
                        self.categoryClass = 'esport';
                        break;
                    case 'App':
                        self.categoryClass = 'mobile';
                        break;
                    default:
                        break;
                }
                path = svg_sprite_path + self.categoryClass;
                return path;
            }
        },
        template: '' +
        '<article :style="enabledArticle" class="timeline-article" :class="this.switchPosition">' +
        '<transition name="transition-article-date">' +
        '<div v-show="visible" class="article-date"><span class="date">{{ article.date.day }}<sup>th</sup></span></div>' +
        '</transition>' +
        '<div class="article-img-container">' +
        '<transition :name="imgTransition">' +
            '<img v-show="article.medias.image && visible" class="article-image" :src="this.article.medias.image" :alt="this.article.title">' +
            // '<video controls="controls" v-show="article.medias.video && visible" class="article-image" :src="this.article.medias.video"></video>' +
        '</transition>' +
        '</div>' +
        '<div class="article-content" >' +
        '<transition name="transition-article-content">' +
        '<main v-show="visible" >' +
        '<header class="article-header" >' +
        '<svg v-show="this.iconCategoryPath" class="icon article-category" :class="this.categoryClass"><use :xlink:href="this.iconCategoryPath"/></svg>' +
        '<h2 class="article-title" v-html="this.article.title"></h2>' +
        '</header>' +
        '<section class="article-body">' +
        '<p class="article-desc" v-html="this.article.description"></p>' +
        '</section>' +
        '<footer>' +
        '<div class="article-links">' +
        '<a :href="this.article.url" target="_blank" rel="nofollow" class="article-link">Read the article</a>' +
        '<a v-show="article.medias.video" :href="this.article.medias.video" class="article-link" target="_blank">See the video</a>' +
        '</div>' +
        '</footer>' +
        '</main>' +
        '</transition>' +
        '<aside class="articles-more">' +
        '<transition v-if="visible"  name="transition-article-aside">' +
        '<ul class="article-tags">' +
        '<li class="article-tag" v-for="tag in article.hashtag">{{ tag }}</li>' +
        '</ul>' +
        '</transition>' +
        '</aside>' +
        '</div>' +
        '</article>'
    };
    var categoryComponent = {
        props: {
            index: Number,
            category: Object,
            classSelected: ''
        },
        mixins: [inViewPort],
        computed: {
            iconClasses: function () {
                var self = this;
                return "category-icon category-icon--" + self.category.icon;
            },
            iconCategoryPath: function () {
                var self = this;
                return svg_sprite_path + self.category.icon;
            },
            above: function () {
                var self = this;
                self.$parent.$parent.$data.fixedCategories = !!self.inViewport.above;
                return self.inViewport.above
            }
        },
        methods: {
            toggleCategory: function () {
                var self = this;
                if (self.$parent.$el.classList.contains('fixed')) {
                    var parent = self.$parent.$parent;
                    var index = parent.$data.activeCategories.indexOf(self.category.index);
                    if (index === -1) {
                        parent.$data.activeCategories.push(self.category.index);
                        self.classSelected = 'selected'
                    } else {
                        parent.$data.activeCategories.splice(index, 1);
                        self.classSelected = ''
                    }
                }
            }
        },
        template: '<li @click="toggleCategory" class="category" :class="classSelected">' +
        '<div :class="this.iconClasses">' +
        '<svg class="icon" >' +
        '<use :xlink:href="this.iconCategoryPath" />' +
        '</svg>' +
        '</div>' +
        '<p class="category-name" v-html="this.category.name"></p>' +
        '</li><!--' +
        '-->'
    };
    var monthComponent = {
        props: {
            month: String
        },
        computed: {
            visibleComputed: function () {
                var self = this;
                return self.inViewport.now;
            }
        },
        mixins: [inViewPort],
        template: '<transition name="transition-article-grow">' +
        '<header v-show="visibleComputed" class="month-title">' +
        '<h1>{{ month }}</h1>' +
        '</header>' +
        '</transition>'
    };
    return new Vue({
        el: el,
        data: {
            articles: TIMELINE,
            fixedCategories: false,
            activeCategories: [],
            categories: {
                0: {
                    index: 0,
                    name: 'Connected Devices',
                    icon: 'connected'
                },
                1: {
                    index: 1,
                    name: 'Mobile<br/>Apps',
                    icon: 'mobile'
                },
                2: {
                    index: 2,
                    name: 'E-Sport',
                    icon: 'esport'
                },
                3: {
                    index: 3,
                    name: 'Virtual Reality',
                    icon: 'vr'
                },
                4: {
                    index: 4,
                    name: 'Interactive Experiences',
                    icon: 'interactive'
                }
            }
        },
        mixins: [inViewPort],
        computed: {
            fixedCategoriesClasses: function () {
                var self = this;
                // return self.inViewport.above ? 'fixed' : '';
            },
            visibleComputed: function () {
                var self = this;
                return self.inViewport.now;
            }
        },
        components: {
            'article-component': articleComponent,
            'category-component': categoryComponent,
            'month-component': monthComponent
        }
    });

}

/**
 * function init Landing
 */
function initLanding(id) {
    var baseline = document.getElementById('landing-base-line');

    var opts = {
        duration: 50,
        file: 'assets/svg/landing.svg',
        type: 'scenario',
        animTimingFunction: Vivus.EASE,
        reverseStack: true
    };
    var landing = new Vivus(id, opts , function () {
        baseline.classList.add('animate')
    });

}


