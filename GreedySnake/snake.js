/*
 * @Author: 汐潮
 * @Date: 2021-01-21 09:56:53
 * @LastEditTime: 2021-01-21 18:18:08
 * @LastEditors: 汐潮
 * @Description: In User Settings Edit
 * @FilePath: \GreedySnake\snake.js
 */

window.onload = function () {
  init()
}

function init () {
  initGame()
}

function addEvent(el,name,fn){  
  if(el.addEventListener) return el.addEventListener(name,fn,false);//在火狐中会执行这一句
  return el.attachEvent('on'+name,fn);//在ie中执行这一句
}

function getStyles (obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return getComputedStyle(obj, false)[attr];
  }
}


var initGame = (function () {
  var wrap = document.getElementsByClassName('wrap')[0],
      wrapW = 500,
      wrapH = 500
      // wrapW = getStyles(wrap, 'width'),
      // wrapH = getStyles(wrap, 'height')
      t = null;
  var Snake = function () {
    this.bodyArr = [
      { x: 0, y: 0 },
      { x: 0, y: 20 },
      { x: 0, y: 40 },
      { x: 0, y: 60 },
      { x: 0, y: 80 },
      { x: 0, y: 100 },
    ]
    // 方向的指向
    this.dir = 'DOWN'
    // 绑定事件 改变 this.dir
  }

  Snake.prototype = {
    // 所有的初始化
    init: function () {
      this.bindEvent()
      this.createFood()
      this.initSnake()
      this.run()
    },
    // 所有的绑定事件处理函数
    bindEvent: function () {
      addEvent(document, 'keydown', this.changeDir.bind(this));
    },
    initSnake: function () {
      var arr = this.bodyArr,
        len = arr.length,
        frag = document.createDocumentFragment(),
        item
      // document.createDocumentFragment 文档碎片 不在dom结构中
      // 相当于一个容器，每次循环使用 文档碎片接收，在循环体外再添加到 dom 中, 性能优化
      for (var i = 0; i < len; i++) {
        item = arr[i]

        // 根据数组创建 蛇身
        var round = document.createElement('i')
        round.className = i == len - 1 ? 'round head'
                                       : 'round'
        round.style.left = item.x + 'px'
        round.style.top = item.y + 'px'

        frag.appendChild(round)
      }

      wrap.appendChild(frag)

    },

    run: function() {
      var _self = this
      t = setInterval(function(){
        _self.move()
      }, 500);
    },

    move: function () {
      var arr = this.bodyArr,
        len = arr.length,
        head = arr[len - 1]

      for (var i = 0; i < len; i++) {
        if (i === len - 1) {
          this.setHeadXY(arr)
        } else {
          arr[i].x = arr[i + 1].x
          arr[i].y = arr[i + 1].y
        }
      }
      this.eatFood(arr)
      this.removeSnake()
      this.initSnake()
      this.headInBody(arr)
    },

    setHeadXY: function (arr) {
      var head = arr[arr.length - 1];
      switch (this.dir) {
        case 'LEFT':
          if (head.x <= 0) {
            head.x = wrapW - 20;
          } else {
            head.x -= 20;
          }
          break;
        case 'RIGHT':
          if (head.x >= wrapW - 20) {
            head.x = 0
          } else {
            head.x += 20
          }
          break;
        case 'UP':
          if (head.y <= 0) {
            head.y = wrapH - 20
          } else {
            head.y -= 20
          }
          break;
        case 'DOWN':
          if (head.y >= wrapH - 20) {
            head.y = 0
          } else {
            head.y += 20
          }
          break;
        default:
          break;
      }
    },
    // 判断是否死亡
    headInBody: function (arr) {
      var headX = arr[arr.length - 1].x,
          headY = arr[arr.length - 1].y,
          item;

      // 循环绿色 排除头部
      for (var i = 0; i < arr.length - 2; i++) {
        item = arr[i];
        if (headX === item.x && headY === item.y) {
          setTimeout(() => {
            alert('Game Over');
            clearInterval(t)
            this.removeSnake()
          }, 0);
        }
      }
    },

    removeSnake: function() {
      // 清除原有
      var bodys = document.getElementsByClassName('round');

      while(bodys.length > 0) {
        bodys[0].remove()
      }
    },
    changeDir: function(e) {
      var e = e || window.event,
          code = e.keyCode;

      this.setDir(code);
    },
    setDir: function(code) {
      // 同方向按键无效
      // 向上或下走 上下按键无效
      // 向左或下右 左右按键无效
      switch(code) {
        case 37:
          if(this.dir !== 'RIGHT' && this.dir !== 'LEFT')
            this.dir = 'LEFT'
          break;
        case 39:
          if(this.dir !== 'RIGHT' && this.dir !== 'LEFT')
            this.dir = 'RIGHT'
          break;
        case 38:
          if(this.dir !== 'UP' && this.dir !== 'DOWN')
            this.dir = 'UP'
          break;
        case 40:
          if(this.dir !== 'UP' && this.dir !== 'DOWN')
            this.dir = 'DOWN'
          break;
        default:
            break;
      }
    },
    createFood: function() {
      var food = document.createElement('i')
      food.className = 'food'
      food.style.left =this.setRandomPos(wrapW)  * 20 + 'px'
      food.style.top =this.setRandomPos(wrapH)  * 20 + 'px'
      wrap.appendChild(food);
    },
    setRandomPos: function (wOrh) {
      return Math.floor(Math.random() * (wOrh / 20))
    },
    eatFood: function (arr) {
      var food = document.getElementsByClassName('food')[0],
          foodX = getStyles(food, 'left'),
          foodY = getStyles(food, 'top'),
          headX = arr[arr.length - 1].x,
          headY = arr[arr.length - 1].y,
          x,
          y;
      if(headX + 'px' === foodX && headY + 'px' === foodY) {
        this.removeFood();
        this.createFood();
        // x = arr[0].x - (arr[1].x - arr[0].x)
        // y = arr[0].y - (arr[1].y - arr[0].y)
        // arr.unshift({x, y})
        if (arr[0].x === arr[1].x) {
          x = arr[0].x;
          if (arr[0].y > arr[1].y) {
            y = arr[0].y + 20
          } else if (arr[0].y < arr[1].y) {
            y = arr[0].y - 20
          }
        } else if (arr[0].y === arr[1].y) {
          y = arr[0].y
          if (arr[0].x > arr[1].x) {
            x = arr[0].x + 20
          } else if (arr[0].x < arr[1].x) {
            x = arr[0].x - 20
          }
        }

        arr.unshift({x, y})
      }
    },
    removeFood: function() {
      var food = document.getElementsByClassName('food')[0]
      food.remove()
    }
  }

  return new Snake().init()
})