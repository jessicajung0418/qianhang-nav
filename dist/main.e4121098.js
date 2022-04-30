// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
// 目标一：实现新增功能，并且LOGO为首字母
// 目标二：保存用户数据
// 目标三：优化url，避免因用户复制的链接有很多后缀导致link显示太长。解决方法：使用正则，删除/及后面的内容
// 目标四：删除功能，其中要实现阻止跳转页面事件冒泡，不然点删除也会跳转页面而不是期望的删除事件
// 目标五：做PC端，会使用到@media
// 目标六：添加键盘事件：用户输入单个字母就打开与其logo相同字母的网站


var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x');
var xObject = JSON.parse(x);

// 保存数据--这个还没学，在算法与数据结构课程里                  
var hashMap = xObject || [{ logo: 'X', url: 'https://xiedaimala.com' },
// { logo: './zhihu.jpg', logoType: 'image', url: 'https://www.zhihu.com'},
{ logo: 'Z', url: 'https://www.zhihu.com' }, { logo: 'M', url: 'https://developer.mozilla.org' }];
var simplifyUrl = function simplifyUrl(url) {
    return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); // 删除/及后面的内容
};

var render = function render() {
    $siteList.find('li:not(.last)').remove(); // 不找最后一个li，并且把之前的li都删掉
    hashMap.forEach(function (node, index) {
        // .close那里，关闭按钮一律不要用x，这里是老师为了偷懒，后期自己要进行优化
        // 添加链接时不要用a标签，会导致阻止冒泡失败
        var $li = $('<li>\n                <div class="site">\n                    <div class="logo">' + node.logo + '</div>\n                    <div class="link">' + simplifyUrl(node.url) + '</div>\n                    <div class="close">\n                        <svg class="icon">\n                          <use xlink:href="#icon-close"></use>\n                        </svg>\n                    </div>\n                </div> \n            </li>').insertBefore($lastLi);
        // 代替a标签，给li添加链接
        $li.on('click', function () {
            window.open(node.url);
        });
        // 阻止冒泡 以及 删除网站并重新渲染
        $li.on('click', '.close', function (e) {
            e.stopPropagation();
            hashMap.splice(index, 1);
            render();
        });
    });
};
render();

$('.addButton').on('click', function () {
    // 用户输入自己想进入的网址
    var url = window.prompt('请问您要添加什么网站？');
    // 识别用户输入的网址链接格式是否正确 (这里是检查网址是否是http开头的，如果不是，那么自动补上)
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    console.log(url);
    // 实现功能：点击新增网站，会增加一个小方块，有自己的logo和链接等，并且logo是网站的首字母
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    });
    render();
});

window.onbeforeunload = function () {
    console.log('页面即将关闭');
    // localStorage只能存字符串
    var string = JSON.stringify(hashMap);
    // console.log(typeof hashMap)
    // console.log(hashMap)
    // console.log(typeof string)
    // console.log(string)
    // 在本地的存储里面设置一个x，它的值就是string
    localStorage.setItem('x', string);
};

// 监听键盘事件
$(document).on('keypress', function (e) {
    console.log(e.key);
    // const key = e.key 简写成下面的
    var key = e.key;

    for (var i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url);
        }
    }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.e4121098.map