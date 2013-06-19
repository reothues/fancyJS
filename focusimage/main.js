  function classFocusimage(dom, o) {
      this.init(dom, o);
  }
  classFocusimage.prototype = {
      options: {
          images: ["http://src.house.sina.com.cn/imp/imp/deal/00/fc/f/221cb8c036ab9ae0c8268d4a35d_p1_mk1.jpg", "http://src.house.sina.com.cn/imp/imp/deal/3d/80/3/0fff8fa6e2ff8cc747b2ef83bb8_p1_mk1.jpg", "http://src.house.sina.com.cn/imp/imp/deal/47/9f/e/a03ab10673512817083a25a6c41_p1_S310X230_mk1.jpg"],
          links: ["#", "#", "#"],
          texts: [" ", " ", " "],
          switchStyle: "slideX",
          duration: 500,
          interval: 3000,
          slices: 8,
          listStyle: "",
          exclusive: false,
          auto: true,
          order: "default",
          callback: false,
          eventName: "mouseover",
          frames: 20
      }
      , createStyle: function (str) {
          var style = document.createElement('style');
          style.type = 'text/css';
          document.getElementsByTagName('head')[0].appendChild(style);
          if (style.styleSheet) {
              style.styleSheet.cssText = str;
          } else {
              style.textContent = str;
          }
      }
      , createContainer: function () {
          var container = document.createElement("div");
          container.setAttribute("class", "container_fix_dj");
          container.style["background-image"] = "url(" + this.options.images[0] + ")";
          container.id = "xray" + Date.now();
          return container
      }
      , createShade: function () {
          var shade = document.createElement("div");
          shade.setAttribute("class", "shade");
          shade.innerHTML = "&nbsp;";
          shade.style.opacity = 0.7;
          return shade;
      }
      , createSubtitle: function () {
          var subtitle = document.createElement("div");
          subtitle.setAttribute("class", "subtitle");
          subtitle.innerHTML = this.options.texts[0];
          this.subtitle = subtitle;
          return subtitle
      }
      , createList: function () {
          var o = this.options;
          var list = document.createElement("div");
          list.setAttribute("class", "list");

          if (o.listStyle) {
              if (typeof o.listStyle == "object")
                  list.style(o.listStyle);
              else
                  list.setAttribute("class", "list " + o.listStyle);
          }

          var prev = document.createElement("div");
          prev.setAttribute("class", 'prev');
          prev.appendChild(document.createTextNode(" "));
          list.appendChild(prev);
          var node, fn = [];
          // create node
          for (var i = 0; i < o.images.length; i++) {
              var node = document.createElement("div");
              node.setAttribute("class", "node");
              if (o.thumbnails) {
                  node.innerHTML = "<img src='" + o.thumbnails[i] + "'/><span>" + (i + 1) + "</span>"
              } else {
                  node.appendChild(document.createTextNode(i + 1));
              }
              fn[i] = (function(that, idx){ return function () {
                      that.subtitle.innerHTML = that.options.texts[idx];
                      that.motions[that.options.switchStyle].call(that, idx)
                      
                      if(that.options.interval){
                          if(that.config.int) clearTimeout(that.config.int);
                          that.config.int = setTimeout(fn[idx + 1], that.options.interval)
                      } 
                  }                             
              })(this,i)
              if (node.addEventListener) {
                  node.addEventListener(this.options.eventName, fn[i], false);
              } else if (node.attachEvent) {
                  node.attachEvent('on' + this.options.eventName, fn[i]);
              }
              list.appendChild(node);
          }
          fn.push(fn[0]);
          var next = document.createElement("div");
          next.setAttribute("class", 'next');
          next.appendChild(document.createTextNode(" "));
          list.appendChild(next);
          return list
      }
      , initDOM: function () {
          var container = this.createContainer();
          container.appendChild(this.createShade());
          container.appendChild(this.createSubtitle());
          container.appendChild(this.createList());

          return container;
      }
      , initConfig: function (dom) {
          var ret = {};
          ret.imgWidth = dom.clientWidth;
          ret.imgHeight = dom.clientHeight;
          ret.sliceHeight = parseInt(ret.imgHeight / this.options.slices);
          ret.slicewidth = parseInt(ret.imgWidth / this.options.slices);
          ret.zIndex = 100;
          ret.steps = this.options.duration / this.options.frames;
          return ret;
      }
      , initCSS: function () {
          var ystep = this.config.sliceHeight / this.config.steps;
          var xstep = this.config.slicewidth / this.config.steps;
          var css = "";
          for (var i = 0; i <= this.config.steps; i++) {
              css += "#" + this.container.id + ".container_fix_dj a.xstep" + i + "{width:" + parseInt(i * xstep) + "px}";
              css += "#" + this.container.id + ".container_fix_dj a.ystep" + i + "{height:" + parseInt(i * ystep) + "px}";
          }
          this.createStyle(css);
      }
      , init: function (dom, options) {
          for (var key in options) {
              this.options[key] = options[key];
          }
          this.dom = dom;
          var container = this.initDOM();
          this.container = container;
          dom.appendChild(container);

          this.config = this.initConfig(dom);
          this.initCSS();
      }
      , createYSlices: function (img) {
          var motionId = "y" + (new Date());
          var ret = []
          for (var sx = 0; sx < this.config.imgHeight; sx += this.config.sliceHeight) {
              var _slice = document.createElement("A");
              _slice.style["position"] = "absolute";
              _slice.style["top"] = sx + "px";
              _slice.style["background"] = "url(" + img + ") 0 " + (-1 * sx) + "px repeat-x";
              _slice.style["width"] = "100%";
              _slice.style["z-index"] = this.config.zIndex;
              _slice.setAttribute("class", motionId);

              this.container.appendChild(_slice);
              ret.push(_slice);
          }
          return ret;
      }
      , createXSlices: function (img) {
          var motionId = "x" + (new Date());
          var ret = []
          for (var sx = 0; sx < this.config.imgWidth; sx += this.config.slicewidth) {
              var _slice = document.createElement("A");
              _slice.style["position"] = "absolute";
              _slice.style["left"] = sx + "px";
              _slice.style["background"] = "url(" + img + ")" + (-1 * sx) + "px 0 repeat-x";
              _slice.style["height"] = "100%";
              _slice.style["z-index"] = this.config.zIndex;
              _slice.setAttribute("class", motionId);

              this.container.appendChild(_slice);
              ret.push(_slice);
          }
          return ret;
      }
      , motions: {
          _setup: function (step, end) {
              var _fn = (function (container, steps, frames) {
                  var current = 0;
                  return function () {
                      if (current < steps) {
                          step(container, current)
                          current++;
                          setTimeout(_fn, frames);
                      } else {
                          end(container);
                      }

                  }
              })(this.container, this.config.steps, this.options.frames);
              _fn();
          }
          , slideX: function (index) {
              var img = this.options.images[index]
              , xlices = this.createXSlices(img);
              this.motions._setup.call(this, function (container, current) {
                  for (var i = 0, domS; domS = xlices[i]; i++) {
                      domS.setAttribute("class", "xstep" + current);
                  }
              }, function (container) {
                  container.style["backgroundImage"] = "url(" + img + ")";
                  for (var i = 0, domS; domS = xlices[i]; i++) {
                      container.removeChild(domS);
                  }
              })
          }
          , slideY: function (index) {
              var img = this.options.images[index]
              , ylices = this.createYSlices(img);
              this.motions._setup.call(this, function (container, current) {
                  for (var i = 0, domS; domS = ylices[i]; i++) {
                      domS.setAttribute("class", "ystep" + current);
                  }
              }, function (container) {
                  container.style["backgroundImage"] = "url(" + img + ")";
                  for (var i = 0, domS; domS = ylices[i]; i++) {
                      container.removeChild(domS);
                  }
              })
          }
          , shutterX: function (index) {
              var img = this.options.images[index]
              , xlices = this.createXSlices(img);

              var steps = this.config.steps
              , idxDone = 0
              , critical = 1 - (this.options.slices - 1) * 0.08
              , step08 = steps * 0.08;
              this.motions._setup.call(this, function (container, current) {
                  for (var i = idxDone, domS; domS = xlices[i]; i++) {
                      var _sx = (current - i * step08)  // parseInt(now * imgWidth - idx * 0.25 * slicewidth);    //var _sx = parseInt((now * slices - idx * 0.3) * slicewidth);
                      if (_sx > 0) {
                          _sx = parseInt(_sx / critical)
                          if (_sx >= steps) {
                              idxDone = i;
                              _sx = steps;
                          }
                          domS.setAttribute("class", "xstep" + _sx);
                      }
                  }
              }, function (container) {
                  container.style["backgroundImage"] = "url(" + img + ")";
                  for (var i = 0, domS; domS = xlices[i]; i++) {
                      container.removeChild(domS);
                  }
              })
          }
      }

  }
