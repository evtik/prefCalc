(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CardRow;

CardRow = (function() {
  function CardRow(table, pack) {
    var card, i;
    this.table = table;
    this.pack = pack;
    this.pack.cards.sort(this.pack.cardSorter(['s', 'd', 'c', 'h']));
    this.cards = (function() {
      var _i, _len, _ref, _results;
      _ref = this.pack.cards;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        card = _ref[i];
        _results.push({
          suit: card.suit,
          value: card.value,
          packIndex: i
        });
      }
      return _results;
    }).call(this);
    this.cardRowGroup = [];
    this.renderCardRow();
  }

  return CardRow;

})();

CardRow.prototype.setHovers = function() {
  var el, _i, _len, _ref, _results;
  _ref = this.cardRowGroup;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    _results.push(el.hover(this.hoverInCard, this.hoverOutCard));
  }
  return _results;
};

CardRow.prototype.unSetHovers = function() {
  var el, _i, _len, _ref, _results;
  _ref = this.cardRowGroup;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    _results.push(el.unhover(this.hoverInCard, this.hoverOutCard));
  }
  return _results;
};

CardRow.prototype.renderCardRow = function() {
  var card, cardGroup, cardSpacingX, cardSpacingY, el, i, nextTransform, self, shift, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
  if (this.cards.length) {
    _ref = this.cardRowGroup;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      el = _ref[i];
      el.remove();
    }
    this.cardRowGroup = [];
    self = this;
    this.cardShifts = [];
    this.cards.sort(this.pack.cardSorter(['s', 'd', 'c', 'h']));
    _ref1 = this.cards;
    for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
      card = _ref1[i];
      cardGroup = this.table.snapArea.g();
      cardGroup.data('packIndex', card.packIndex).data('rowIndex', i).data('cardRow', self).add(self.pack.cards[card.packIndex].pic.select('svg').clone()).drag(this.dragMoveCard, this.dragStartCard, this.dragEndCard).hover(this.hoverInCard, this.hoverOutCard);
      this.cardRowGroup.push(cardGroup);
    }
    _ref2 = this.cardRowGroup;
    _results = [];
    for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
      el = _ref2[i];
      cardSpacingX = ((this.table.width - this.table.cardWidth) / (this.cards.length + 1)) / this.table.cardSizeRatio;
      cardSpacingY = this.table.cardHeight * .5;
      shift = cardSpacingX * i;
      this.cardShifts.push(shift);
      el.data('currentTransform', "t" + (cardSpacingX * this.table.cardSizeRatio) + " ," + cardSpacingY + " s" + this.table.cardSizeRatio + ",0,0");
      el.transform(el.data('currentTransform'));
      nextTransform = "" + (el.data('currentTransform')) + "t" + shift + ",0";
      el.stop().animate({
        transform: nextTransform
      }, 500, mina.backout);
      _results.push(el.data('currentTransform', nextTransform));
    }
    return _results;
  }
};

CardRow.prototype.hoverInCard = function() {
  return this.stop().animate({
    transform: "" + (this.data('currentTransform')) + "t0 ," + (-(this.data('cardRow')).pack.cardHeight * .4)
  }, 200, mina.elastic);
};

CardRow.prototype.hoverOutCard = function() {
  return this.stop().animate({
    transform: "" + (this.data('currentTransform')) + "t0 ,0"
  }, 200, mina.backout);
};

CardRow.prototype.dragMoveCard = function(dx, dy, x, y) {
  var cardRow, hand, name, _ref, _ref1;
  cardRow = this.data('cardRow');
  if (!cardRow.table.dragClone && (dx || dy)) {
    cardRow.table.dragClone = this.clone();
    cardRow.table.mouseDownCard = null;
    cardRow.table.snapArea.add(cardRow.table.dragClone);
    this.attr({
      visibility: 'hidden'
    });
    _ref = cardRow.table.hands;
    for (name in _ref) {
      hand = _ref[name];
      hand.fanFrame.attr({
        visibility: 'visible'
      });
    }
  }
  return (_ref1 = cardRow.table.dragClone) != null ? _ref1.transform("t" + (x - cardRow.table.pack.cardWidth / 2) + " ," + (y - cardRow.table.pack.cardHeight / 2) + "s" + cardRow.table.cardSizeRatio) : void 0;
};

CardRow.prototype.dragStartCard = function() {
  var cardRow, hand, name, _ref, _results;
  cardRow = this.data('cardRow');
  cardRow.table.mouseDownCard = this;
  cardRow.unSetHovers();
  _ref = cardRow.table.hands;
  _results = [];
  for (name in _ref) {
    hand = _ref[name];
    _results.push(hand.unSetHovers());
  }
  return _results;
};

CardRow.prototype.dragEndCard = function(e) {
  var animClone, animToHand, card, cardRow, currentHand, hand, name, picked, selectedHand, tableHand, _ref, _ref1, _ref2, _results;
  card = this;
  cardRow = this.data('cardRow');
  if (!cardRow.table.dragClone) {
    if (this === cardRow.table.mouseDownCard) {
      currentHand = 'west';
      if (e.ctrlKey) {
        if (e.shiftKey) {
          currentHand = 'east';
        } else {
          currentHand = 'south';
        }
      }
      picked = cardRow.cards.splice(this.data('rowIndex'), 1);
      animClone = this.clone();
      this.remove();
      cardRow.table.snapArea.add(animClone);
      animToHand = "t" + cardRow.table.coords[currentHand].x + ", " + cardRow.table.coords[currentHand].y + " s" + cardRow.table.cardSizeRatio + ",0,0";
      animClone.stop().animate({
        transform: animToHand
      }, 180, mina.backout);
      setTimeout((function() {
        var name, selectedHand, tableHand, _ref;
        animClone.remove();
        picked[0].hand = currentHand;
        selectedHand = cardRow.table.hands["" + currentHand];
        selectedHand.cards.push(picked[0]);
        cardRow.renderCardRow();
        selectedHand.renderHand();
        _ref = cardRow.table.hands;
        for (name in _ref) {
          tableHand = _ref[name];
          tableHand.setHovers();
        }
        return selectedHand.setDrags();
      }), 200);
    }
  } else {
    _ref = cardRow.table.hands;
    for (name in _ref) {
      hand = _ref[name];
      if (Snap.path.isPointInside(hand.fanFramePath, e.pageX, e.pageY)) {
        selectedHand = hand;
        break;
      }
    }
    if (selectedHand) {
      picked = cardRow.cards.splice(this.data('rowIndex'), 1);
      picked[0].hand = selectedHand.seat;
      selectedHand.cards.push(picked[0]);
      cardRow.table.dragClone.remove();
      cardRow.table.dragClone = null;
      cardRow.renderCardRow();
      selectedHand.renderHand();
      _ref1 = cardRow.table.hands;
      for (name in _ref1) {
        tableHand = _ref1[name];
        tableHand.setHovers();
        tableHand.setDrags();
      }
    } else {
      if (cardRow.table.dragClone) {
        cardRow.table.dragClone.stop().animate({
          transform: "" + (this.data('currentTransform')) + "t0,0"
        }, 400, mina.backout);
        setTimeout((function() {
          cardRow.table.dragClone.remove();
          cardRow.table.dragClone = null;
          card.transform("" + (card.data('currentTransform')) + "t0,0");
          card.attr({
            visibility: 'visible'
          });
          return cardRow.setHovers();
        }), 401);
      }
    }
  }
  _ref2 = cardRow.table.hands;
  _results = [];
  for (name in _ref2) {
    hand = _ref2[name];
    _results.push(hand.fanFrame.attr({
      visibility: 'hidden'
    }));
  }
  return _results;
};

module.exports = CardRow;


},{}],2:[function(require,module,exports){
var Hand, Trick, utils;

require('./array-utils');

utils = require('./utils');

Trick = require('./Trick');

Hand = (function() {
  function Hand(toolBar, table, pack, seat, cards, isBlind, isWidow) {
    var arr;
    this.toolBar = toolBar;
    this.table = table;
    this.pack = pack;
    this.seat = seat;
    this.cards = cards;
    this.isBlind = isBlind;
    this.isWidow = isWidow;
    this.shiftAngle = 12;
    if (Math.floor(Math.random() * 2)) {
      arr = this.pack.sortValues.slice();
      this.ranDirectionValues = arr.reverse();
    } else {
      this.ranDirectionValues = this.pack.sortValues;
    }
    this.fanFrame = this.table.snapArea.path("");
    this.renderFanFrame();
    this.grad = this.table.snapArea.gradient("r(.5,.5,.95)#00f-#fff");
    this.blurFilter = this.table.snapArea.filter(Snap.filter.blur(2, 2));
    this.fanFrame.attr({
      strokeWidth: 4,
      stroke: 'green',
      filter: this.blurFilter,
      opacity: .3,
      fill: 'transparent',
      visibility: 'hidden'
    });
    this.handCardsCounter = this.table.snapArea.text(0, 0, "");
    this.handCardsCounter.attr({
      fill: 'white',
      'text-anchor': 'middle'
    });
    this.cards = [];
    this.handGroup = [];
    this.tricks = [];
    this.tricksGroup = [];
    this.renderHand();
  }

  return Hand;

})();

Hand.prototype.renderFanFrame = function() {
  var values;
  values = this.table.coords["" + this.seat];
  this.fanFramePath = utils.describeSector(values.sectorFanX, values.sectorFanY, this.table.coords.fanInnerR, this.table.coords.fanOuterR, -this.shiftAngle * 3.8, this.shiftAngle * 3.8);
  return this.fanFrame.attr({
    d: this.fanFramePath
  });
};

Hand.prototype.getTrickCoords = function(index) {
  var angle, coords, height, hypo, offset, shift, size, startX, startY, tr, width, xShift, yShift;
  startX = this.table.coords[this.seat].x;
  startY = this.table.coords[this.seat].y;
  height = this.table.cardHeight;
  width = this.table.cardWidth;
  size = height - width;
  offset = 0;
  angle = Snap.deg(Math.atan(width / height));
  hypo = (Math.sqrt((Math.pow(width, 2)) + (Math.pow(height, 2)))) / 2;
  coords = [];
  if (this.seat === 'south') {
    xShift = hypo * Math.cos(Snap.rad(-angle - 90 + 45));
    shift = index * 2 * (xShift + offset);
    if (!(index % 2)) {
      tr = "s" + this.table.cardSizeRatio + "," + this.table.cardSizeRatio + "r45T" + (startX + shift) + "," + startY;
    } else {
      tr = "s" + this.table.cardSizeRatio + "," + this.table.cardSizeRatio + "r-45T" + (startX + shift) + "," + startY;
    }
    coords.push(startX + shift + this.pack.cardWidth / 2);
    coords.push(startY + this.pack.cardHeight / 2);
  } else {
    yShift = hypo * Math.sin(Snap.rad(-270 + angle + 45));
    shift = index * 2 * (yShift + offset);
    if (!(index % 2)) {
      tr = "s" + this.table.cardSizeRatio + "," + this.table.cardSizeRatio + "r45T" + startX + "," + (startY + shift);
    } else {
      tr = "s" + this.table.cardSizeRatio + "," + this.table.cardSizeRatio + "r-45T" + startX + "," + (startY + shift);
    }
    coords.push(startX + this.pack.cardWidth / 2);
    coords.push(startY + shift + this.pack.cardHeight / 2);
  }
  coords.push(tr);
  return coords;
};

Hand.prototype.renderTricks = function() {
  var alignTr, back, backGroup, box, circle, i, lastTrickCenter, number, size, t, trArr, trick, _i, _j, _len, _len1, _ref, _ref1, _results;
  if (this.tricksGroup.length) {
    _ref = this.tricksGroup;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      t = _ref[_i];
      t.remove();
    }
    this.tricksGroup = [];
  }
  if (this.tricks.length) {
    _ref1 = this.tricks;
    _results = [];
    for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
      trick = _ref1[i];
      backGroup = this.table.snapArea.g().attr({
        visibility: 'hidden'
      });
      back = this.table.snapArea.g().add(this.pack.backBlue.clone());
      backGroup.add(back);
      trArr = this.getTrickCoords(i);
      back.transform(trArr[2]);
      if (i === (this.tricks.length - 1)) {
        size = this.table.cardHeight - this.table.cardWidth;
        circle = this.table.snapArea.circle(0, 0, (this.table.cardHeight - this.table.cardWidth) * .6).attr({
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1
        });
        number = this.table.snapArea.text(0, size * .8 / 2, i + 1).attr({
          fill: 'black',
          'font-size': size * .8,
          'text-anchor': 'middle'
        });
        box = number.getBBox();
        alignTr = "t0,-" + (box.y + box.h / 2);
        lastTrickCenter = "t" + trArr[0] + "," + trArr[1];
        circle.transform(lastTrickCenter);
        number.transform("" + lastTrickCenter + alignTr);
        backGroup.add(circle, number);
      }
      backGroup.attr({
        visibility: 'visible'
      });
      _results.push(this.tricksGroup.push(backGroup));
    }
    return _results;
  }
};

Hand.prototype.getSortOrders = function() {
  var card, checks, currentSuits, sameColors, suit, uniqueSuits;
  sameColors = ['d', 'h'];
  currentSuits = (function() {
    var _i, _len, _ref, _results;
    _ref = this.cards;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      card = _ref[_i];
      _results.push(card.suit);
    }
    return _results;
  }).call(this);
  uniqueSuits = currentSuits.unique();
  this.sortedUniqueSuits = [];
  if (uniqueSuits.length <= 2) {
    return this.sortedUniqueSuits = uniqueSuits;
  } else {
    checks = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = uniqueSuits.length; _i < _len; _i++) {
        suit = uniqueSuits[_i];
        _results.push(sameColors.exists(suit));
      }
      return _results;
    })();
    if (checks[0] === !checks[1]) {
      if (checks[1] === !checks[2]) {
        return this.sortedUniqueSuits = uniqueSuits;
      } else {
        return this.sortedUniqueSuits.push(uniqueSuits[1], uniqueSuits[0], uniqueSuits[2], uniqueSuits[3]);
      }
    } else {
      return this.sortedUniqueSuits.push(uniqueSuits[0], uniqueSuits[2], uniqueSuits[1], uniqueSuits[3]);
    }
  }
};

Hand.prototype.getAllowedSuit = function(currentSuit) {
  var card, handSuits, uniqueHandSuits;
  this.allowedSuit = null;
  if (this.table.appMode === 'moving') {
    handSuits = (function() {
      var _i, _len, _ref, _results;
      _ref = this.cards;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        card = _ref[_i];
        _results.push(card.suit);
      }
      return _results;
    }).call(this);
    uniqueHandSuits = handSuits.unique();
    if (uniqueHandSuits.exists(currentSuit)) {
      return this.allowedSuit = currentSuit;
    } else {
      if (uniqueHandSuits.exists(this.table.deal.trump)) {
        return this.allowedSuit = this.table.deal.trump;
      }
    }
  }
};

Hand.prototype.setHovers = function(currentSuit) {
  var el, lastTrick, _i, _len, _ref, _results;
  if (currentSuit && this.table.appMode === 'moving') {
    lastTrick = this.table.deal.tricks[this.table.deal.tricks.length - 1];
    if (lastTrick.cards.length === 1) {
      this.getAllowedSuit(currentSuit);
    }
  }
  _ref = this.handGroup;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    if (!(this.allowedSuit && (el.data('suit')) !== this.allowedSuit)) {
      _results.push(el.hover(this.hoverInCard, this.hoverOutCard));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

Hand.prototype.unSetHovers = function() {
  var el, _i, _len, _ref, _results;
  _ref = this.handGroup;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    _results.push(el.unhover(this.hoverInCard, this.hoverOutCard));
  }
  return _results;
};

Hand.prototype.setDrags = function() {
  var el, _i, _len, _ref, _results;
  _ref = this.handGroup;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    if (!(this.allowedSuit && (el.data('suit')) !== this.allowedSuit)) {
      _results.push(el.drag(this.dragMoveCard, this.dragStartCard, this.dragEndCard));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

Hand.prototype.unSetDrags = function() {
  var el, _i, _len, _ref, _results;
  _ref = this.handGroup;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    _results.push(el.undrag());
  }
  return _results;
};

Hand.prototype.hoverInCard = function() {
  return this.stop().animate({
    transform: "" + (this.data('currentTransform')) + "t0 ," + (-(this.data('hand')).pack.cardHeight * .4)
  }, 200, mina.elastic);
};

Hand.prototype.hoverOutCard = function() {
  return this.stop().animate({
    transform: "" + (this.data('currentTransform')) + "t0 ,0"
  }, 200, mina.backout);
};

Hand.prototype.dragMoveCard = function(dx, dy, x, y) {
  var hand, name, tableHand, _ref, _ref1;
  hand = this.data('hand');
  if (!hand.table.dragClone && (dx || dy)) {
    hand.table.dragClone = this.clone();
    hand.table.mouseDownCard = null;
    hand.table.snapArea.add(hand.table.dragClone);
    this.attr({
      visibility: 'hidden'
    });
    if (hand.table.appMode === 'dealing') {
      _ref = hand.table.hands;
      for (name in _ref) {
        tableHand = _ref[name];
        if (tableHand !== hand) {
          tableHand.fanFrame.attr({
            visibility: 'visible'
          });
        }
      }
    }
  }
  if (hand.table.appMode === 'dealing') {
    return (_ref1 = hand.table.dragClone) != null ? _ref1.transform("t" + (x - hand.table.pack.cardWidth / 2) + " ," + (y - hand.table.pack.cardHeight / 2) + "s" + hand.table.cardSizeRatio) : void 0;
  }
};

Hand.prototype.dragStartCard = function() {
  var hand, name, tableHand, _ref, _ref1, _results;
  hand = this.data('hand');
  hand.table.mouseDownCard = this;
  if ((_ref = hand.table.cardRow) != null) {
    _ref.unSetHovers();
  }
  _ref1 = hand.table.hands;
  _results = [];
  for (name in _ref1) {
    tableHand = _ref1[name];
    _results.push(tableHand.unSetHovers());
  }
  return _results;
};

Hand.prototype.dragEndCard = function(e) {
  var animClone, animToCenter, animToRow, card, currentTransform, hand, lastTrick, name, picked, selectedHand, tableHand, trickX, trickY, _ref, _ref1, _ref2, _results;
  card = this;
  hand = this.data('hand');
  if (!hand.table.dragClone) {
    if (this === hand.table.mouseDownCard) {
      picked = hand.cards.splice(this.data('handIndex'), 1);
      animClone = this.clone();
      this.remove();
      hand.table.snapArea.add(animClone);
      if (hand.table.appMode === 'moving') {
        lastTrick = hand.table.deal.tricks[hand.table.deal.tricks.length - 1];
        currentTransform = this.data('currentTransform');
        animClone.transform(("t" + (e.pageX - hand.pack.cardWidth / 2) + ",") + ("" + (e.pageY - hand.pack.cardHeight / 2) + ",") + ("s" + hand.table.cardSizeRatio));
        trickX = hand.table.coords.center.x - lastTrick.shiftsRotations["" + hand.seat].shift.x;
        trickY = hand.table.coords.north.y - lastTrick.shiftsRotations["" + hand.seat].shift.y;
        animToCenter = ("t" + trickX + "," + trickY) + ("s" + hand.table.cardSizeRatio) + ("r" + lastTrick.shiftsRotations["" + hand.seat].rotation);
        animClone.stop().animate({
          transform: animToCenter
        }, 300);
        return setTimeout((function() {
          animClone.remove();
          lastTrick.cards.push(picked[0]);
          lastTrick.renderTrick();
          hand.bindMovesToTrick(lastTrick.cards[0].suit);
          return hand.renderHand();
        }), 310);
      } else {
        animToRow = "t" + hand.table.coords.north.x + ", " + hand.table.coords.lowerRow.y + " s" + hand.table.cardSizeRatio;
        animClone.stop().animate({
          transform: animToRow
        }, 180, mina.backout);
        return setTimeout((function() {
          var name, tableHand, _ref;
          animClone.remove();
          hand.table.cardRow.cards.push(picked[0]);
          hand.table.cardRow.renderCardRow();
          hand.renderHand();
          _ref = hand.table.hands;
          for (name in _ref) {
            tableHand = _ref[name];
            tableHand.setHovers();
          }
          return hand.setDrags();
        }), 200);
      }
    }
  } else {
    _ref = hand.table.hands;
    for (name in _ref) {
      tableHand = _ref[name];
      if (tableHand !== hand) {
        if (Snap.path.isPointInside(tableHand.fanFramePath, e.pageX, e.pageY)) {
          selectedHand = tableHand;
          break;
        }
      }
    }
    if (selectedHand) {
      picked = hand.cards.splice(this.data('handIndex'), 1);
      picked[0].hand = selectedHand.seat;
      selectedHand.cards.push(picked[0]);
      hand.table.dragClone.remove();
      hand.table.dragClone = null;
      if ((_ref1 = hand.table.cardRow) != null) {
        _ref1.setHovers();
      }
      hand.renderHand();
      selectedHand.renderHand();
      _ref2 = hand.table.hands;
      _results = [];
      for (name in _ref2) {
        tableHand = _ref2[name];
        tableHand.fanFrame.attr({
          visibility: 'hidden'
        });
        tableHand.setHovers();
        _results.push(tableHand.setDrags());
      }
      return _results;
    } else {
      if (hand.table.dragClone) {
        hand.table.dragClone.stop().animate({
          transform: "" + (this.data('currentTransform')) + "t0,0"
        }, 400, mina.backout);
        return setTimeout((function() {
          var _ref3, _results1;
          hand.table.dragClone.remove();
          hand.table.dragClone = null;
          card.transform("" + (card.data('currentTransform')) + "t0,0");
          card.attr({
            visibility: 'visible'
          });
          hand.table.mouseDownCard = null;
          _ref3 = hand.table.hands;
          _results1 = [];
          for (name in _ref3) {
            tableHand = _ref3[name];
            tableHand.fanFrame.attr({
              visibility: 'hidden'
            });
            _results1.push(tableHand.setHovers());
          }
          return _results1;
        }), 401);
      }
    }
  }
};

Hand.prototype.bindMovesToTrick = function(currentSuit) {
  var cloneLastTrick, lastTrick, self, winner, winnerHand;
  self = this;
  lastTrick = this.table.deal.tricks[this.table.deal.tricks.length - 1];
  switch (lastTrick.cards.length) {
    case 0:
      this.table.hands["" + lastTrick.hands[0]].setHovers();
      return this.table.hands["" + lastTrick.hands[0]].setDrags();
    case 1:
      this.table.hands["" + lastTrick.hands[1]].setHovers(currentSuit);
      this.table.hands["" + lastTrick.hands[1]].setDrags();
      return this.table.hands["" + lastTrick.hands[2]].setHovers(currentSuit);
    case 2:
      this.table.hands["" + lastTrick.hands[1]].unSetDrags();
      this.table.hands["" + lastTrick.hands[2]].setHovers();
      return this.table.hands["" + lastTrick.hands[2]].setDrags();
    case 3:
      this.table.hands["" + lastTrick.hands[2]].unSetDrags();
      winner = lastTrick.getWinnerCard().hand;
      winnerHand = this.table.hands["" + winner];
      winnerHand.allowedSuit = null;
      cloneLastTrick = Object.create(lastTrick);
      winnerHand.tricks.push(cloneLastTrick);
      self.table.deal.firstHand = winnerHand.seat;
      self.table.deal.tricks.push(new Trick(this.table, this.pack));
      lastTrick.animateTrickToHand(1000, winnerHand);
      return setTimeout((function() {
        winnerHand.renderTricks();
        winnerHand.renderHand();
        return winnerHand.bindMovesToTrick();
      }), 1200);
  }
};

Hand.prototype.renderHand = function() {
  var areTheSame, card, cardGroup, cardRotation, cardRotationCenter, el, h, i, n, nextTransform, numbers, rotationAngle, self, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _results;
  if (this.table.appMode === 'dealing') {
    if (this.cards.length) {
      numbers = [];
      _ref = this.table.hands;
      for (n in _ref) {
        h = _ref[n];
        numbers.push(h.cards.length);
      }
      areTheSame = true;
      for (i = _i = 0, _len = numbers.length; _i < _len; i = ++_i) {
        el = numbers[i];
        if (numbers[i + 1] >= 0) {
          if (el !== numbers[i + 1]) {
            areTheSame = false;
            break;
          }
        }
      }
      if (areTheSame) {
        this.toolBar.buttons.start[0].attr({
          fill: 'white'
        });
        this.toolBar.buttons.start.data('isActive', true);
      } else {
        if (this.toolBar.buttons.start.data('isActive')) {
          this.toolBar.buttons.start[0].attr({
            fill: '#444'
          });
          this.toolBar.buttons.start.data('isActive', false);
        }
      }
    } else {
      if (this.toolBar.buttons.start.data('isActive')) {
        this.toolBar.buttons.start[0].attr({
          fill: '#444'
        });
        this.toolBar.buttons.start.data('isActive', false);
      }
    }
  }
  if (this.cards.length) {
    _ref1 = this.handGroup;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      el = _ref1[_j];
      el.remove();
    }
    this.handGroup = [];
    self = this;
    this.cardRotations = [];
    this.getSortOrders();
    this.cards.sort(this.pack.cardSorter(this.sortedUniqueSuits, this.ranDirectionValues));
    _ref2 = this.cards;
    for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
      card = _ref2[i];
      cardGroup = this.table.snapArea.g();
      cardGroup.data('packIndex', card.packIndex).data('handIndex', i).data('suit', card.suit).data('value', card.value).data('hand', self).add(self.pack.cards[card.packIndex].pic.select('svg').clone());
      this.handGroup.push(cardGroup);
    }
    this.handCardsCounter.transform("t" + this.table.coords[this.seat].sectorFanX + " ," + (this.table.coords[this.seat].sectorFanY - this.table.cardHeight / 4)).attr({
      text: this.cards.length,
      'font-size': this.table.cardHeight / 4,
      visibility: 'visible'
    });
    _ref3 = this.handGroup;
    _results = [];
    for (i = _l = 0, _len3 = _ref3.length; _l < _len3; i = ++_l) {
      el = _ref3[i];
      rotationAngle = self.shiftAngle * (i - this.cards.length / 2 - .5);
      cardRotation = "r" + rotationAngle;
      this.cardRotations.push(rotationAngle);
      el.transform("t0,0s1,0,0r0,0,0");
      el.data('currentTransform', ("t" + this.table.coords[this.seat].x) + ("," + this.table.coords[this.seat].y + "s" + this.table.cardSizeRatio + ",0,0"));
      el.transform("" + (el.data('currentTransform')));
      cardRotationCenter = "," + this.table.coords.rotX + "," + this.table.coords.rotY;
      nextTransform = ("" + (el.data('currentTransform')) + cardRotation) + ("" + cardRotationCenter);
      el.stop().animate({
        transform: nextTransform
      }, 500, mina.backout);
      _results.push(el.data('currentTransform', nextTransform));
    }
    return _results;
  } else {
    return this.handCardsCounter.attr({
      visibility: 'hidden'
    });
  }
};

module.exports = Hand;


},{"./Trick":6,"./array-utils":8,"./utils":9}],3:[function(require,module,exports){
var Pack, iced, __iced_k, __iced_k_noop;

iced = require('iced-runtime');
__iced_k = __iced_k_noop = function() {};

Pack = (function() {
  function Pack(cb) {
    this.cardNames = ['7c', '8c', '9c', '10c', 'jc', 'qc', 'kc', 'ac', '7d', '8d', '9d', '10d', 'jd', 'qd', 'kd', 'ad', '7h', '8h', '9h', '10h', 'jh', 'qh', 'kh', 'ah', '7s', '8s', '9s', '10s', 'js', 'qs', 'ks', 'as'];
    this.cards = [];
    this.sortValues = ['7', '8', '9', '10', 'j', 'q', 'k', 'a'];
    this.getPack(function() {
      return cb();
    });
  }

  return Pack;

})();

Pack.prototype.getPack = function(cb) {
  var back_blue, back_red, c, cardPic, clubs_card, diamonds_card, hearts_card, i, pack, spades_card, ___iced_passed_deferral, __iced_deferrals, __iced_k;
  __iced_k = __iced_k_noop;
  ___iced_passed_deferral = iced.findDeferral(arguments);
  pack = [];
  (function(_this) {
    return (function(__iced_k) {
      var _i, _len, _ref, _results, _while;
      _ref = _this.cardNames;
      _len = _ref.length;
      i = 0;
      _results = [];
      _while = function(__iced_k) {
        var _break, _continue, _next;
        _break = function() {
          return __iced_k(_results);
        };
        _continue = function() {
          return iced.trampoline(function() {
            ++i;
            return _while(__iced_k);
          });
        };
        _next = function(__iced_next_arg) {
          _results.push(__iced_next_arg);
          return _continue();
        };
        if (!(i < _len)) {
          return _break();
        } else {
          c = _ref[i];
          (function(__iced_k) {
            __iced_deferrals = new iced.Deferrals(__iced_k, {
              parent: ___iced_passed_deferral,
              funcname: "Pack.getPack"
            });
            Snap.load("cards/" + c + ".svg", __iced_deferrals.defer({
              assign_fn: (function() {
                return function() {
                  return cardPic = arguments[0];
                };
              })(),
              lineno: 14
            }));
            __iced_deferrals._fulfill();
          })(function() {
            return _next(pack.push({
              suit: c.slice(-1),
              value: c.slice(-3, -1),
              pic: cardPic
            }));
          });
        }
      };
      _while(__iced_k);
    });
  })(this)((function(_this) {
    return function() {
      _this.cards = pack;
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          funcname: "Pack.getPack"
        });
        Snap.load("cards/back_blue.svg", __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return back_blue = arguments[0];
            };
          })(),
          lineno: 18
        }));
        Snap.load("cards/back_red.svg", __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return back_red = arguments[0];
            };
          })(),
          lineno: 19
        }));
        Snap.load("cards/clubs.svg", __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return clubs_card = arguments[0];
            };
          })(),
          lineno: 20
        }));
        Snap.load("cards/diamonds.svg", __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return diamonds_card = arguments[0];
            };
          })(),
          lineno: 21
        }));
        Snap.load("cards/hearts.svg", __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return hearts_card = arguments[0];
            };
          })(),
          lineno: 22
        }));
        Snap.load("cards/spades.svg", __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return spades_card = arguments[0];
            };
          })(),
          lineno: 23
        }));
        __iced_deferrals._fulfill();
      })(function() {
        _this.backBlue = back_blue.select('svg');
        _this.backRed = back_red.select('svg');
        _this.clubs = clubs_card.select('svg');
        _this.diamonds = diamonds_card.select('svg');
        _this.hearts = hearts_card.select('svg');
        _this.spades = spades_card.select('svg');
        _this.cardWidth = _this.cards[0].pic.node.children[0].attributes.width.value;
        _this.cardHeight = _this.cards[0].pic.node.children[0].attributes.height.value;
        return cb();
      });
    };
  })(this));
};

Pack.prototype.shuffle = function() {
  var i, m, t, _results;
  m = this.cards.length;
  _results = [];
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = this.cards[m];
    this.cards[m] = this.cards[i];
    _results.push(this.cards[i] = t);
  }
  return _results;
};

Pack.prototype.cardSorter = function(sortSuits, sortValues) {
  if (sortValues == null) {
    sortValues = this.sortValues;
  }
  return function(current, next) {
    if (sortSuits.indexOf(current.suit) < sortSuits.indexOf(next.suit)) {
      return -1;
    }
    if (sortSuits.indexOf(current.suit) > sortSuits.indexOf(next.suit)) {
      return 1;
    }
    if (sortValues.indexOf(current.value) < sortValues.indexOf(next.value)) {
      return 1;
    }
    if (sortValues.indexOf(current.value) > sortValues.indexOf(next.value)) {
      return -1;
    }
  };
};

module.exports = Pack;


},{"iced-runtime":13}],4:[function(require,module,exports){
var Table;

Table = (function() {
  function Table(width, height, pack) {
    this.pack = pack;
    this.mouseDownCard = null;
    this.dragClone = null;
    this.snapArea = Snap();
    this.fanShiftFactor = 1.8;
    this.getCoords(width, height);
    this.cardRow = {};
    this.hands = {};
  }

  return Table;

})();

Table.prototype.getCoords = function(width, height) {
  this.width = width;
  this.height = height;
  this.cardWidth = this.width * 0.11;
  this.cardSizeRatio = this.cardWidth / this.pack.cardWidth;
  this.cardHeight = this.pack.cardHeight * this.cardSizeRatio;
  return this.coords = {
    rotX: this.pack.cardWidth / 4,
    rotY: this.pack.cardHeight,
    center: {
      x: (this.width - this.pack.cardWidth) / 2,
      y: (this.height - this.pack.cardHeight) / 2
    },
    fanInnerR: this.cardHeight * .55,
    fanOuterR: this.cardHeight * 1.95,
    south: {
      x: (this.width - this.cardWidth) / 2 + this.cardWidth / 4,
      y: (this.height - this.cardHeight * 1.2) * .88,
      sectorFanX: (this.width - this.cardWidth) / 2 + this.cardWidth / 2,
      sectorFanY: (this.height - this.cardHeight * 1.2) * .88 + this.cardHeight * this.fanShiftFactor
    },
    north: {
      x: (this.width - this.cardWidth) / 2 + this.cardWidth / 4,
      y: (this.height - this.cardHeight * 1.2) * .12,
      sectorFanX: (this.width - this.cardWidth) / 2 + this.cardWidth / 2,
      sectorFanY: (this.height - this.cardHeight * 1.2) * .12 + this.cardHeight * this.fanShiftFactor
    },
    west: {
      x: (this.width - this.cardWidth * .8) * .2 + this.cardWidth / 4,
      y: (this.height - this.cardHeight) / 2,
      sectorFanX: (this.width - this.cardWidth * .8) * .2 + this.cardWidth / 2,
      sectorFanY: (this.height - this.cardHeight) / 2 + this.cardHeight * this.fanShiftFactor
    },
    east: {
      x: (this.width - this.cardWidth * .8) * .8 + this.cardWidth / 4,
      y: (this.height - this.cardHeight) / 2,
      sectorFanX: (this.width - this.cardWidth * .8) * .8 + this.cardWidth / 2,
      sectorFanY: (this.height - this.cardHeight) / 2 + this.cardHeight * this.fanShiftFactor
    },
    lowerRow: {
      y: this.cardHeight * .5
    }
  };
};

Table.prototype.getNextHand = function(currentHand) {
  var hands, nextHand;
  hands = ['west', 'east', 'south'];
  if ((hands.indexOf(currentHand)) < (hands.length - 1)) {
    nextHand = hands[(hands.indexOf(currentHand)) + 1];
  } else {
    nextHand = hands[0];
  }
  return nextHand;
};

module.exports = Table;


},{}],5:[function(require,module,exports){
var ToolBar, iced, __iced_k, __iced_k_noop;

iced = require('iced-runtime');
__iced_k = __iced_k_noop = function() {};

ToolBar = (function() {
  function ToolBar(table, cb) {
    this.table = table;
    this.height = 48;
    this.margin = 4;
    this.buttons = {};
    this.shadow = this.table.snapArea.filter(Snap.filter.shadow(7, 7, 3, 'black', .8));
    this.getButtons(function() {
      return cb();
    });
  }

  return ToolBar;

})();

ToolBar.prototype.getButtons = function(cb) {
  var b, backImage, backsvg, clubs_suit, clubssvg, diamonds_suit, diamondssvg, disabledButtonAttrs, enabledButtonAttrs, forwardImage, forwardsvg, hearts_suit, heartssvg, n, newImage, newsvg, spades_suit, spadessvg, startImage, startsvg, suitButtonAttrs, tr, upperRect, xShift, ___iced_passed_deferral, __iced_deferrals, __iced_k;
  __iced_k = __iced_k_noop;
  ___iced_passed_deferral = iced.findDeferral(arguments);
  enabledButtonAttrs = {
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
    visibility: 'hidden'
  };
  disabledButtonAttrs = {
    fill: '#444',
    stroke: 'black',
    strokeWidth: 1,
    visibility: 'hidden'
  };
  (function(_this) {
    return (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {
        parent: ___iced_passed_deferral,
        funcname: "ToolBar.getButtons"
      });
      Snap.load("icons/document.svg", __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return newImage = arguments[0];
          };
        })(),
        lineno: 17
      }));
      Snap.load("icons/flag-2.svg", __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return startImage = arguments[0];
          };
        })(),
        lineno: 18
      }));
      Snap.load("icons/arrow-left.svg", __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return backImage = arguments[0];
          };
        })(),
        lineno: 19
      }));
      Snap.load("icons/arrow-right.svg", __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return forwardImage = arguments[0];
          };
        })(),
        lineno: 20
      }));
      Snap.load("icons/clubs.svg", __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return clubs_suit = arguments[0];
          };
        })(),
        lineno: 21
      }));
      Snap.load("icons/diamonds.svg", __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return diamonds_suit = arguments[0];
          };
        })(),
        lineno: 22
      }));
      Snap.load("icons/hearts.svg", __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return hearts_suit = arguments[0];
          };
        })(),
        lineno: 23
      }));
      Snap.load("icons/spades.svg", __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return spades_suit = arguments[0];
          };
        })(),
        lineno: 24
      }));
      __iced_deferrals._fulfill();
    });
  })(this)((function(_this) {
    return function() {
      var _ref;
      newsvg = newImage.select('svg').attr(enabledButtonAttrs);
      _this.buttons.newDeal = _this.table.snapArea.g(newsvg).data('toolBarIndex', 1).data('isActive', true);
      startsvg = startImage.select('svg').attr(disabledButtonAttrs);
      _this.buttons.start = _this.table.snapArea.g(startsvg).data('toolBarIndex', 3).data('isActive', false);
      backsvg = backImage.select('svg').attr(disabledButtonAttrs);
      _this.buttons.back = _this.table.snapArea.g(backsvg).data('toolBarIndex', 4).data('isActive', false);
      forwardsvg = forwardImage.select('svg').attr(disabledButtonAttrs);
      _this.buttons.forward = _this.table.snapArea.g(forwardsvg).data('toolBarIndex', 5).data('isActive', false);
      suitButtonAttrs = {
        visibility: 'hidden',
        stroke: 'white',
        strokeWidth: .3
      };
      spadessvg = spades_suit.select('svg').attr(suitButtonAttrs).data('suit', 's');
      clubssvg = clubs_suit.select('svg').attr(suitButtonAttrs).data('suit', 'c');
      diamondssvg = diamonds_suit.select('svg').attr(suitButtonAttrs).data('suit', 'd');
      heartssvg = hearts_suit.select('svg').attr(suitButtonAttrs).data('suit', 'h');
      _this.buttons.suit = _this.table.snapArea.g(spadessvg, clubssvg, diamondssvg, heartssvg);
      _this.buttons.suit.data('toolBarIndex', 2).data('isActive', true).data('imagesCount', 4).data('activeImage', 0);
      _ref = _this.buttons;
      for (n in _ref) {
        b = _ref[n];
        upperRect = _this.table.snapArea.rect(0, 0, _this.height, _this.height).attr({
          fill: 'transparent'
        });
        b.add(upperRect);
        xShift = _this.margin * 2 + ((b.data('toolBarIndex')) - 1) * (48 + _this.margin);
        tr = "t" + xShift + "," + (_this.margin * 2);
        b.transform(tr);
        b.data('currentTransform', tr);
        b.data('toolBar', _this);
        b[0].attr({
          visibility: 'visible'
        });
        b.attr({
          filter: _this.shadow
        });
        b.hover((function() {
          if (this.data('isActive')) {
            return this.stop().animate({
              transform: "" + (this.data('currentTransform')) + "s1.15"
            }, 50, mina.easein);
          }
        }), (function() {
          if (this.data('isActive')) {
            return this.stop().animate({
              transform: "" + (this.data('currentTransform')) + "s1"
            }, 150, mina.easeout);
          }
        }), b.mousedown(function() {
          if (this.data('isActive')) {
            return this.transform("" + (this.data('currentTransform')) + "s.95t2,2");
          }
        }), b.mouseup(function() {
          var count, current, next;
          if (this.data('isActive')) {
            this.transform("" + (this.data('currentTransform')) + "s1.15");
            if (this.data('imagesCount')) {
              count = this.data('imagesCount');
              current = this.data('activeImage');
              if (current === count - 1) {
                next = 0;
              } else {
                next = current + 1;
              }
              this[current].attr({
                visibility: 'hidden'
              });
              this[next].attr({
                visibility: 'visible'
              });
              return this.data('activeImage', next);
            }
          } else {
            return this.transform("" + (this.data('currentTransform')));
          }
        }));
      }
      return cb();
    };
  })(this));
};

module.exports = ToolBar;


},{"iced-runtime":13}],6:[function(require,module,exports){
var Trick, utils;

utils = require('./utils');

Trick = (function() {
  function Trick(table, pack) {
    this.table = table;
    this.pack = pack;
    this.cards = [];
    this.hands = [];
    this.hands.push(this.table.deal.firstHand);
    this.hands.push(this.table.getNextHand(this.hands[0]));
    this.hands.push(this.table.getNextHand(this.hands[1]));
    this.trickGroup = [];
    this.shiftsRotations = {};
    this.getRandoms();
  }

  return Trick;

})();

Trick.prototype.renderTrick = function() {
  var card, cardGroup, el, hand, handName, self, tr, trickX, trickY, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
  if (this.cards.length) {
    _ref = this.trickGroup;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      el.remove();
    }
    this.trickGroup = [];
    self = this;
    _ref1 = this.cards;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      card = _ref1[_j];
      cardGroup = this.table.snapArea.g();
      cardGroup.data('packIndex', card.packIndex).data('hand', card.hand).data('trick', self).add(self.pack.cards[card.packIndex].pic.select('svg').clone());
      this.trickGroup.push(cardGroup);
    }
    _ref2 = this.trickGroup;
    _results = [];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      el = _ref2[_k];
      el.transform("t0,0s1,0,0r0,0,0");
      handName = el.data('hand');
      hand = this.table.hands["" + handName];
      trickX = hand.table.coords.center.x - this.shiftsRotations["" + hand.seat].shift.x;
      trickY = hand.table.coords.north.y - this.shiftsRotations["" + hand.seat].shift.y;
      tr = ("t" + trickX + "," + trickY) + ("s" + hand.table.cardSizeRatio) + ("r" + this.shiftsRotations["" + hand.seat].rotation);
      _results.push(el.transform(tr));
    }
    return _results;
  }
};

Trick.prototype.animateTrickToHand = function(animDuration, hand) {
  var back, self;
  self = this;
  if (this.cards.length === 3) {
    back = this.table.snapArea.g();
    setTimeout((function() {
      var el, _i, _len, _ref, _results;
      _ref = self.trickGroup;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(el.stop().animate({
          transform: "T" + self.table.coords.center.x + " ," + self.table.coords.north.y + "S" + self.table.cardSizeRatio + "R0"
        }, animDuration * .2, mina.easein));
      }
      return _results;
    }), animDuration * .2);
    setTimeout((function() {
      var el, i, _i, _len, _ref, _results;
      _ref = self.trickGroup;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        el = _ref[i];
        if (i !== 2) {
          _results.push(el.remove());
        }
      }
      return _results;
    }), animDuration * .4);
    setTimeout((function() {
      self.trickGroup[2].stop().animate({
        transform: "t" + self.table.coords.center.x + " ," + self.table.coords.north.y + "s.0001 ," + self.table.cardSizeRatio + "r0"
      }, animDuration * .2);
      return setTimeout((function() {
        self.trickGroup[2].remove();
        return self.trickGroup = [];
      }), animDuration * .2 + 10);
    }), animDuration * .6);
    setTimeout((function() {
      back.add(self.pack.backBlue.clone());
      back.attr({
        visibility: 'hidden'
      });
      back.transform("s.0001," + self.table.cardSizeRatio + "r0T" + self.table.coords.center.x + "," + self.table.coords.north.y);
      back.attr({
        visibility: 'visible'
      });
      return back.stop().animate({
        transform: "s" + self.table.cardSizeRatio + " ," + self.table.cardSizeRatio + "r0T" + self.table.coords.center.x + " ," + self.table.coords.north.y
      }, animDuration * .2);
    }), animDuration * .8);
    return setTimeout((function() {
      var tr;
      tr = hand.getTrickCoords(hand.tricks.length - 1);
      back.stop().animate({
        transform: tr[2]
      }, animDuration * .2);
      return setTimeout((function() {
        return back.remove();
      }), animDuration * .2 + 10);
    }), animDuration);
  }
};

Trick.prototype.getRandoms = function() {
  this.shiftsRotations.west = {
    rotation: (utils.getRandomInt(1, 5)) * 360 - 54 - (utils.getRandomInt(0, 9)) * 1.5,
    shift: {
      x: (this.pack.cardWidth * .35) - (utils.getRandomInt(0, 6)) * 0.03 * this.pack.cardWidth,
      y: 0
    }
  };
  this.shiftsRotations.south = {
    rotation: (utils.getRandomInt(1, 5)) * 354 + (utils.getRandomInt(0, 9)) * 1.5,
    shift: {
      x: 0,
      y: (this.pack.cardHeight * .35) - (utils.getRandomInt(0, 6)) * 0.03 * this.pack.cardHeight
    }
  };
  return this.shiftsRotations.east = {
    rotation: (utils.getRandomInt(1, 5)) * 360 + 54 + (utils.getRandomInt(0, 9)) * 1.5,
    shift: {
      x: (this.pack.cardWidth * -.35) + (utils.getRandomInt(0, 6)) * 0.03 * this.pack.cardWidth,
      y: 0
    }
  };
};

Trick.prototype.getWinnerCard = function() {
  var compareCards, self;
  self = this;
  compareCards = function(first, second) {
    if (first.suit !== self.table.deal.trump) {
      if (second.suit !== self.table.deal.trump) {
        if (second.suit === first.suit) {
          if ((self.pack.sortValues.indexOf(first.value)) > (self.pack.sortValues.indexOf(second.value))) {
            return first;
          } else {
            return second;
          }
        } else {
          return first;
        }
      } else {
        return second;
      }
    } else {
      if (second.suit !== self.table.deal.trump) {
        return first;
      } else {
        if ((self.pack.sortValues.indexOf(first.value)) > (self.pack.sortValues.indexOf(second.value))) {
          return first;
        } else {
          return second;
        }
      }
    }
  };
  return compareCards(compareCards(this.cards[0], this.cards[1]), this.cards[2]);
};

module.exports = Trick;


},{"./utils":9}],7:[function(require,module,exports){
var CardRow, Hand, Pack, Table, ToolBar, Trick, cards, iced, pack, startDealing, table, tb, toolBar, utils, __iced_deferrals, __iced_k, __iced_k_noop;

iced = require('iced-runtime');
__iced_k = __iced_k_noop = function() {};

ToolBar = require('./ToolBar');

Pack = require('./Pack');

Hand = require('./Hand');

Table = require('./Table');

CardRow = require('./CardRow');

Trick = require('./Trick');

utils = require('./utils');

(function(_this) {
  return (function(__iced_k) {
    __iced_deferrals = new iced.Deferrals(__iced_k, {});
    pack = new Pack(__iced_deferrals.defer({
      assign_fn: (function() {
        return function() {
          return cards = arguments[0];
        };
      })(),
      lineno: 8
    }));
    __iced_deferrals._fulfill();
  });
})(this)((function(_this) {
  return function() {
    table = new Table(window.innerWidth, window.innerHeight, pack);
    table.trump = 's';
    (function(__iced_k) {
      __iced_deferrals = new iced.Deferrals(__iced_k, {});
      toolBar = new ToolBar(table, __iced_deferrals.defer({
        assign_fn: (function() {
          return function() {
            return tb = arguments[0];
          };
        })(),
        lineno: 13
      }));
      __iced_deferrals._fulfill();
    })(function() {
      toolBar.buttons.newDeal.click(function() {
        var tb;
        tb = this.data('toolBar');
        tb.buttons.suit.data('isActive', true);
        return startDealing();
      });
      toolBar.buttons.suit.click(function() {
        return table.trump = this[this.data('activeImage')].data('suit');
      });
      toolBar.buttons.start.click(function() {
        var el, hand, tb, _i, _j, _len, _len1, _ref, _ref1;
        this.data('isActive', false);
        this.transform("" + (this.data('currentTransform')));
        this[0].attr({
          fill: '#444'
        });
        tb = this.data('toolBar');
        tb.buttons.suit.data('isActive', false);
        table.appMode = 'moving';
        table.deal = {};
        table.deal.tricks = [];
        table.deal.trump = table.trump;
        table.deal.firstHand = 'west';
        table.deal.tricks.push(new Trick(table, pack));
        _ref = table.deal.tricks[0].hands;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          hand = _ref[_i];
          table.hands["" + hand].unSetHovers();
          table.hands["" + hand].unSetDrags();
        }
        table.hands["" + table.deal.firstHand].bindMovesToTrick();
        _ref1 = table.cardRow.cardRowGroup;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          el = _ref1[_j];
          el.remove();
        }
        return table.cardRow = null;
      });
      startDealing = function() {
        var el, hand, name, _i, _j, _len, _len1, _ref, _ref1, _ref2;
        table.appMode = 'dealing';
        _ref = table.hands;
        for (name in _ref) {
          hand = _ref[name];
          hand.handCardsCounter.remove();
          _ref1 = hand.handGroup;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            el = _ref1[_i];
            el.remove();
          }
          _ref2 = hand.tricksGroup;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            el = _ref2[_j];
            el.remove();
          }
        }
        table.cardRow = new CardRow(table, pack);
        table.hands.west = new Hand(toolBar, table, pack, 'west', table.appMode);
        table.hands.east = new Hand(toolBar, table, pack, 'east', table.appMode);
        table.hands.south = new Hand(toolBar, table, pack, 'south', table.appMode);
        return null;
      };
      startDealing();
      return window.addEventListener('resize', function() {
        var hand, lastTrick, name, _ref, _ref1, _ref2;
        table.getCoords(window.innerWidth, window.innerHeight);
        if ((_ref = table.cardRow) != null) {
          _ref.renderCardRow();
        }
        lastTrick = (_ref1 = table.deal) != null ? _ref1.tricks[table.deal.tricks.length - 1] : void 0;
        if (lastTrick != null) {
          lastTrick.renderTrick();
        }
        _ref2 = table.hands;
        for (name in _ref2) {
          hand = _ref2[name];
          if (table.appMode === 'moving') {
            hand.renderTricks();
          }
          hand.renderHand();
          if (table.appMode === 'dealing') {
            hand.renderFanFrame();
            hand.setHovers();
            hand.setDrags();
          }
        }
        if (table.appMode === 'moving') {
          switch (lastTrick.cards.length) {
            case 0:
              table.hands["" + lastTrick.hands[0]].setHovers();
              return table.hands["" + lastTrick.hands[0]].setDrags();
            case 1:
              table.hands["" + lastTrick.hands[1]].setHovers();
              table.hands["" + lastTrick.hands[1]].setDrags();
              return table.hands["" + lastTrick.hands[2]].setHovers();
            case 2:
              table.hands["" + lastTrick.hands[2]].setHovers();
              return table.hands["" + lastTrick.hands[2]].setDrags();
          }
        }
      });
    });
  };
})(this));


},{"./CardRow":1,"./Hand":2,"./Pack":3,"./Table":4,"./ToolBar":5,"./Trick":6,"./utils":9,"iced-runtime":13}],8:[function(require,module,exports){
Array.prototype.unique = function() {
  var el, i, n, r, _i, _len;
  n = {};
  r = [];
  for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
    el = this[i];
    if (!n[this[i]]) {
      n[this[i]] = true;
      r.push(this[i]);
    }
  }
  return r;
};

Array.prototype.exists = function(val) {
  if (this.indexOf(val) >= 0) {
    return true;
  } else {
    return false;
  }
};

Array.prototype.getNextOrFirstItem = function(item) {
  if (this[(this.indexOf(item)) + 1]) {
    return this[(this.indexOf(item)) + 1];
  } else {
    return this[0];
  }
};


},{}],9:[function(require,module,exports){
var describeArc, polarToCartesian;

exports.getRandomInt = function(min, max) {
  return (Math.floor(Math.random() * (max - min))) + min;
};

polarToCartesian = function(cx, cy, r, angle) {
  angle = (angle - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  };
};

describeArc = function(x, y, r, startAngle, endAngle, continueLine) {
  var alter, end, large, start;
  start = polarToCartesian(x, y, r, startAngle %= 360);
  end = polarToCartesian(x, y, r, endAngle %= 360);
  large = Math.abs(endAngle - startAngle) >= 180;
  alter = endAngle > startAngle;
  return "" + (continueLine ? 'L' : 'M') + start.x + "," + start.y + " A" + r + "," + r + ",0, " + (large ? 1 : 0) + ", " + (alter ? 1 : 0) + ", " + end.x + "," + end.y;
};

exports.describeSector = function(x, y, r, r2, startAngle, endAngle) {
  return "" + (describeArc(x, y, r, startAngle, endAngle)) + " " + (describeArc(x, y, r2, endAngle, startAngle, true)) + "Z";
};


},{}],10:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],11:[function(require,module,exports){
// Generated by IcedCoffeeScript 1.7.1-b
(function() {
  module.exports = {
    k: "__iced_k",
    k_noop: "__iced_k_noop",
    param: "__iced_p_",
    ns: "iced",
    runtime: "runtime",
    Deferrals: "Deferrals",
    deferrals: "__iced_deferrals",
    fulfill: "_fulfill",
    b_while: "_break",
    t_while: "_while",
    c_while: "_continue",
    n_while: "_next",
    n_arg: "__iced_next_arg",
    defer_method: "defer",
    slot: "__slot",
    assign_fn: "assign_fn",
    autocb: "autocb",
    retslot: "ret",
    trace: "__iced_trace",
    passed_deferral: "__iced_passed_deferral",
    findDeferral: "findDeferral",
    lineno: "lineno",
    parent: "parent",
    filename: "filename",
    funcname: "funcname",
    catchExceptions: 'catchExceptions',
    runtime_modes: ["node", "inline", "window", "none", "browserify", "interp"],
    trampoline: "trampoline",
    context: "context",
    defer_arg: "__iced_defer_"
  };

}).call(this);

},{}],12:[function(require,module,exports){
// Generated by IcedCoffeeScript 1.7.1-b
(function() {
  var C, Pipeliner, iced, __iced_k, __iced_k_noop, _iand, _ior, _timeout,
    __slice = [].slice;

  __iced_k = __iced_k_noop = function() {};

  C = require('./const');

  exports.iced = iced = require('./runtime');

  _timeout = function(cb, t, res, tmp) {
    var arr, rv, which, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    rv = new iced.Rendezvous;
    tmp[0] = rv.id(true).defer({
      assign_fn: (function(_this) {
        return function() {
          return function() {
            return arr = __slice.call(arguments, 0);
          };
        };
      })(this)(),
      lineno: 20,
      context: __iced_deferrals
    });
    setTimeout(rv.id(false).defer({
      lineno: 21,
      context: __iced_deferrals
    }), t);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/max/src/iced/iced-runtime/src/library.iced"
        });
        rv.wait(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return which = arguments[0];
            };
          })(),
          lineno: 22
        }));
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (res) {
          res[0] = which;
        }
        return cb.apply(null, arr);
      };
    })(this));
  };

  exports.timeout = function(cb, t, res) {
    var tmp;
    tmp = [];
    _timeout(cb, t, res, tmp);
    return tmp[0];
  };

  _iand = function(cb, res, tmp) {
    var ok, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/max/src/iced/iced-runtime/src/library.iced"
        });
        tmp[0] = __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ok = arguments[0];
            };
          })(),
          lineno: 39
        });
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (!ok) {
          res[0] = false;
        }
        return cb();
      };
    })(this));
  };

  exports.iand = function(cb, res) {
    var tmp;
    tmp = [];
    _iand(cb, res, tmp);
    return tmp[0];
  };

  _ior = function(cb, res, tmp) {
    var ok, ___iced_passed_deferral, __iced_deferrals, __iced_k;
    __iced_k = __iced_k_noop;
    ___iced_passed_deferral = iced.findDeferral(arguments);
    (function(_this) {
      return (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "/Users/max/src/iced/iced-runtime/src/library.iced"
        });
        tmp[0] = __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return ok = arguments[0];
            };
          })(),
          lineno: 58
        });
        __iced_deferrals._fulfill();
      });
    })(this)((function(_this) {
      return function() {
        if (ok) {
          res[0] = true;
        }
        return cb();
      };
    })(this));
  };

  exports.ior = function(cb, res) {
    var tmp;
    tmp = [];
    _ior(cb, res, tmp);
    return tmp[0];
  };

  exports.Pipeliner = Pipeliner = (function() {
    function Pipeliner(window, delay) {
      this.window = window || 1;
      this.delay = delay || 0;
      this.queue = [];
      this.n_out = 0;
      this.cb = null;
      this[C.deferrals] = this;
      this["defer"] = this._defer;
    }

    Pipeliner.prototype.waitInQueue = function(cb) {
      var ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          var _results, _while;
          _results = [];
          _while = function(__iced_k) {
            var _break, _continue, _next;
            _break = function() {
              return __iced_k(_results);
            };
            _continue = function() {
              return iced.trampoline(function() {
                return _while(__iced_k);
              });
            };
            _next = function(__iced_next_arg) {
              _results.push(__iced_next_arg);
              return _continue();
            };
            if (!(_this.n_out >= _this.window)) {
              return _break();
            } else {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/max/src/iced/iced-runtime/src/library.iced",
                  funcname: "Pipeliner.waitInQueue"
                });
                _this.cb = __iced_deferrals.defer({
                  lineno: 100
                });
                __iced_deferrals._fulfill();
              })(_next);
            }
          };
          _while(__iced_k);
        });
      })(this)((function(_this) {
        return function() {
          _this.n_out++;
          (function(__iced_k) {
            if (_this.delay) {
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  filename: "/Users/max/src/iced/iced-runtime/src/library.iced",
                  funcname: "Pipeliner.waitInQueue"
                });
                setTimeout(__iced_deferrals.defer({
                  lineno: 108
                }), _this.delay);
                __iced_deferrals._fulfill();
              })(__iced_k);
            } else {
              return __iced_k();
            }
          })(function() {
            return cb();
          });
        };
      })(this));
    };

    Pipeliner.prototype.__defer = function(out, deferArgs) {
      var tmp, voidCb, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/max/src/iced/iced-runtime/src/library.iced",
            funcname: "Pipeliner.__defer"
          });
          voidCb = __iced_deferrals.defer({
            lineno: 122
          });
          out[0] = function() {
            var args, _ref;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if ((_ref = deferArgs.assign_fn) != null) {
              _ref.apply(null, args);
            }
            return voidCb();
          };
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          _this.n_out--;
          if (_this.cb) {
            tmp = _this.cb;
            _this.cb = null;
            return tmp();
          }
        };
      })(this));
    };

    Pipeliner.prototype._defer = function(deferArgs) {
      var tmp;
      tmp = [];
      this.__defer(tmp, deferArgs);
      return tmp[0];
    };

    Pipeliner.prototype.flush = function(autocb) {
      var ___iced_passed_deferral, __iced_k, _results, _while;
      __iced_k = autocb;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      _results = [];
      _while = (function(_this) {
        var __iced_deferrals;
        return function(__iced_k) {
          var _break, _continue, _next;
          _break = function() {
            return __iced_k(_results);
          };
          _continue = function() {
            return iced.trampoline(function() {
              return _while(__iced_k);
            });
          };
          _next = function(__iced_next_arg) {
            _results.push(__iced_next_arg);
            return _continue();
          };
          if (!_this.n_out) {
            return _break();
          } else {
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/max/src/iced/iced-runtime/src/library.iced",
                funcname: "Pipeliner.flush"
              });
              _this.cb = __iced_deferrals.defer({
                lineno: 151
              });
              __iced_deferrals._fulfill();
            })(_next);
          }
        };
      })(this);
      _while(__iced_k);
    };

    return Pipeliner;

  })();

}).call(this);

},{"./const":11,"./runtime":14}],13:[function(require,module,exports){
// Generated by IcedCoffeeScript 1.7.1-b
(function() {
  var k, mod, mods, v, _i, _len;

  exports["const"] = require('./const');

  mods = [require('./runtime'), require('./library')];

  for (_i = 0, _len = mods.length; _i < _len; _i++) {
    mod = mods[_i];
    for (k in mod) {
      v = mod[k];
      exports[k] = v;
    }
  }

}).call(this);

},{"./const":11,"./library":12,"./runtime":14}],14:[function(require,module,exports){
(function (process){
// Generated by IcedCoffeeScript 1.7.1-b
(function() {
  var C, Deferrals, Rendezvous, exceptionHandler, findDeferral, make_defer_return, stackWalk, tick_counter, trampoline, warn, __active_trace, __c, _trace_to_string,
    __slice = [].slice;

  C = require('./const');

  make_defer_return = function(obj, defer_args, id, trace_template, multi) {
    var k, ret, trace, v;
    trace = {};
    for (k in trace_template) {
      v = trace_template[k];
      trace[k] = v;
    }
    trace[C.lineno] = defer_args != null ? defer_args[C.lineno] : void 0;
    ret = function() {
      var inner_args, o, _ref;
      inner_args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (defer_args != null) {
        if ((_ref = defer_args.assign_fn) != null) {
          _ref.apply(null, inner_args);
        }
      }
      if (obj) {
        o = obj;
        if (!multi) {
          obj = null;
        }
        return o._fulfill(id, trace);
      } else {
        return warn("overused deferral at " + (_trace_to_string(trace)));
      }
    };
    ret[C.trace] = trace;
    return ret;
  };

  __c = 0;

  tick_counter = function(mod) {
    __c++;
    if ((__c % mod) === 0) {
      __c = 0;
      return true;
    } else {
      return false;
    }
  };

  __active_trace = null;

  _trace_to_string = function(tr) {
    var fn;
    fn = tr[C.funcname] || "<anonymous>";
    return "" + fn + " (" + tr[C.filename] + ":" + (tr[C.lineno] + 1) + ")";
  };

  warn = function(m) {
    return typeof console !== "undefined" && console !== null ? console.error("ICED warning: " + m) : void 0;
  };

  exports.trampoline = trampoline = function(fn) {
    if (!tick_counter(500)) {
      return fn();
    } else if (typeof process !== "undefined" && process !== null) {
      return process.nextTick(fn);
    } else {
      return setTimeout(fn);
    }
  };

  exports.Deferrals = Deferrals = (function() {
    function Deferrals(k, trace) {
      this.trace = trace;
      this.continuation = k;
      this.count = 1;
      this.ret = null;
    }

    Deferrals.prototype._call = function(trace) {
      var c;
      if (this.continuation) {
        __active_trace = trace;
        c = this.continuation;
        this.continuation = null;
        return c(this.ret);
      } else {
        return warn("Entered dead await at " + (_trace_to_string(trace)));
      }
    };

    Deferrals.prototype._fulfill = function(id, trace) {
      if (--this.count > 0) {

      } else {
        return trampoline(((function(_this) {
          return function() {
            return _this._call(trace);
          };
        })(this)));
      }
    };

    Deferrals.prototype.defer = function(args) {
      var self;
      this.count++;
      self = this;
      return make_defer_return(self, args, null, this.trace);
    };

    return Deferrals;

  })();

  exports.findDeferral = findDeferral = function(args) {
    var a, _i, _len;
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      a = args[_i];
      if (a != null ? a[C.trace] : void 0) {
        return a;
      }
    }
    return null;
  };

  exports.Rendezvous = Rendezvous = (function() {
    var RvId;

    function Rendezvous() {
      this.completed = [];
      this.waiters = [];
      this.defer_id = 0;
    }

    RvId = (function() {
      function RvId(rv, id, multi) {
        this.rv = rv;
        this.id = id;
        this.multi = multi;
      }

      RvId.prototype.defer = function(defer_args) {
        return this.rv._defer_with_id(this.id, defer_args, this.multi);
      };

      return RvId;

    })();

    Rendezvous.prototype.wait = function(cb) {
      var x;
      if (this.completed.length) {
        x = this.completed.shift();
        return cb(x);
      } else {
        return this.waiters.push(cb);
      }
    };

    Rendezvous.prototype.defer = function(defer_args) {
      var id;
      id = this.defer_id++;
      return this._defer_with_id(id, defer_args);
    };

    Rendezvous.prototype.id = function(i, multi) {
      multi = !!multi;
      return new RvId(this, i, multi);
    };

    Rendezvous.prototype._fulfill = function(id, trace) {
      var cb;
      if (this.waiters.length) {
        cb = this.waiters.shift();
        return cb(id);
      } else {
        return this.completed.push(id);
      }
    };

    Rendezvous.prototype._defer_with_id = function(id, defer_args, multi) {
      this.count++;
      return make_defer_return(this, defer_args, id, {}, multi);
    };

    return Rendezvous;

  })();

  exports.stackWalk = stackWalk = function(cb) {
    var line, ret, tr, _ref;
    ret = [];
    tr = cb ? cb[C.trace] : __active_trace;
    while (tr) {
      line = "   at " + (_trace_to_string(tr));
      ret.push(line);
      tr = tr != null ? (_ref = tr[C.parent]) != null ? _ref[C.trace] : void 0 : void 0;
    }
    return ret;
  };

  exports.exceptionHandler = exceptionHandler = function(err, logger) {
    var stack;
    if (!logger) {
      logger = console.error;
    }
    logger(err.stack);
    stack = stackWalk();
    if (stack.length) {
      logger("Iced 'stack' trace (w/ real line numbers):");
      return logger(stack.join("\n"));
    }
  };

  exports.catchExceptions = function(logger) {
    return typeof process !== "undefined" && process !== null ? process.on('uncaughtException', function(err) {
      exceptionHandler(err, logger);
      return process.exit(1);
    }) : void 0;
  };

}).call(this);

}).call(this,require('_process'))

},{"./const":11,"_process":10}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEOlxcaW5zdGFsbFxcbm9kZWpzXFxwcmVmQ2FsY1xcYXBwXFxDYXJkUm93LmljZWQiLCJEOlxcaW5zdGFsbFxcbm9kZWpzXFxwcmVmQ2FsY1xcYXBwXFxIYW5kLmljZWQiLCJEOlxcaW5zdGFsbFxcbm9kZWpzXFxwcmVmQ2FsY1xcYXBwXFxQYWNrLmljZWQiLCJEOlxcaW5zdGFsbFxcbm9kZWpzXFxwcmVmQ2FsY1xcYXBwXFxUYWJsZS5pY2VkIiwiRDpcXGluc3RhbGxcXG5vZGVqc1xccHJlZkNhbGNcXGFwcFxcVG9vbEJhci5pY2VkIiwiRDpcXGluc3RhbGxcXG5vZGVqc1xccHJlZkNhbGNcXGFwcFxcVHJpY2suaWNlZCIsIkQ6XFxpbnN0YWxsXFxub2RlanNcXHByZWZDYWxjXFxhcHBcXGFwcC5pY2VkIiwiRDpcXGluc3RhbGxcXG5vZGVqc1xccHJlZkNhbGNcXGFwcFxcYXJyYXktdXRpbHMuaWNlZCIsIkQ6XFxpbnN0YWxsXFxub2RlanNcXHByZWZDYWxjXFxhcHBcXHV0aWxzLmljZWQiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2ljZWQtcnVudGltZS9saWIvY29uc3QuanMiLCJub2RlX21vZHVsZXMvaWNlZC1ydW50aW1lL2xpYi9saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2ljZWQtcnVudGltZS9saWIvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9pY2VkLXJ1bnRpbWUvbGliL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLE9BQUE7O0FBQUE7QUFDYyxFQUFBLGlCQUFFLEtBQUYsRUFBVSxJQUFWLEdBQUE7QUFDWixRQUFBLE9BQUE7QUFBQSxJQURhLElBQUMsQ0FBQSxRQUFBLEtBQ2QsQ0FBQTtBQUFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBDYXJkUm93XHJcblx0Y29uc3RydWN0b3I6IChAdGFibGUsIEBwYWNrKSAtPlxyXG5cdFx0QHBhY2suY2FyZHMuc29ydCBAcGFjay5jYXJkU29ydGVyIFsncycsICdkJywgJ2MnLCAnaCddXHJcblx0XHRAY2FyZHMgPSAoc3VpdDogY2FyZC5zdWl0LCB2YWx1ZTogY2FyZC52YWx1ZSwgcGFja0luZGV4OiBpIGZvciBjYXJkLCBpIGluIEBwYWNrLmNhcmRzKVxyXG5cdFx0QGNhcmRSb3dHcm91cCA9IFtdXHJcblx0XHRAcmVuZGVyQ2FyZFJvdygpXHJcblxyXG5DYXJkUm93OjpzZXRIb3ZlcnMgPSAtPlxyXG5cdGZvciBlbCBpbiBAY2FyZFJvd0dyb3VwXHJcblx0XHRlbC5ob3ZlciBAaG92ZXJJbkNhcmQsIEBob3Zlck91dENhcmRcclxuXHJcbkNhcmRSb3c6OnVuU2V0SG92ZXJzID0gLT5cclxuXHRmb3IgZWwgaW4gQGNhcmRSb3dHcm91cFxyXG5cdFx0ZWwudW5ob3ZlciBAaG92ZXJJbkNhcmQsIEBob3Zlck91dENhcmRcclxuXHJcbkNhcmRSb3c6OnJlbmRlckNhcmRSb3cgPSAtPlxyXG5cdGlmIEBjYXJkcy5sZW5ndGhcclxuXHRcdGZvciBlbCwgaSBpbiBAY2FyZFJvd0dyb3VwXHJcblx0XHRcdGVsLnJlbW92ZSgpXHJcblx0XHRAY2FyZFJvd0dyb3VwID0gW11cclxuXHRcdHNlbGYgPSBAXHJcblx0XHRAY2FyZFNoaWZ0cyA9IFtdXHJcblx0XHRAY2FyZHMuc29ydCBAcGFjay5jYXJkU29ydGVyIFsncycsICdkJywgJ2MnLCAnaCddXHJcblx0XHRmb3IgY2FyZCwgaSBpbiBAY2FyZHNcclxuXHRcdFx0Y2FyZEdyb3VwID0gQHRhYmxlLnNuYXBBcmVhLmcoKVxyXG5cdFx0XHRjYXJkR3JvdXBcclxuXHRcdFx0XHQuZGF0YSAncGFja0luZGV4JywgY2FyZC5wYWNrSW5kZXhcclxuXHRcdFx0XHQuZGF0YSAncm93SW5kZXgnLCBpXHJcblx0XHRcdFx0LmRhdGEgJ2NhcmRSb3cnLCBzZWxmXHJcblx0XHRcdFx0LmFkZCBzZWxmLnBhY2suY2FyZHNbY2FyZC5wYWNrSW5kZXhdLnBpYy5zZWxlY3QoJ3N2ZycpLmNsb25lKClcclxuXHRcdFx0XHQjIC5tb3VzZXVwIEBtb3VzZVVwQ2FyZFxyXG5cdFx0XHRcdC5kcmFnIEBkcmFnTW92ZUNhcmQsIEBkcmFnU3RhcnRDYXJkLCBAZHJhZ0VuZENhcmRcclxuXHRcdFx0XHQuaG92ZXIgQGhvdmVySW5DYXJkLCBAaG92ZXJPdXRDYXJkXHJcblxyXG5cdFx0XHRAY2FyZFJvd0dyb3VwLnB1c2ggY2FyZEdyb3VwXHJcblxyXG5cdFx0IyBmb3IgaSwgZWwgb2YgQGNhcmRSb3dHcm91cCB3aGVuIG5vdCBOdW1iZXIuaXNOYU4gK2lcclxuXHRcdGZvciBlbCwgaSBpbiBAY2FyZFJvd0dyb3VwXHJcblx0XHRcdCMg0L3QsNGB0YLRg9C/0L3RliAyINGA0Y/QtNC60Lgg0L3QtSDQvNC+0LbRgyDQstC40L3QtdGB0YLQuCDRgyDQutC70LDRgSBUYWJsZVxyXG5cdFx0XHQjINCy0YHQtdGA0LXQtNC40L3RliDRhtGM0L7Qs9C+INC60LvQsNGB0YMg0YfQvtC80YPRgdGMINC90LXQvNCw0ZQg0LTQvtGB0YLRg9C/0YNcclxuXHRcdFx0IyDQtNC+INC30L7QstC90ZYg0LTQvtC00LDQvdC40YUg0L3QvtCy0LjRhSDQstC70LDRgdGC0LjQstC+0YHRgtC10LlcclxuXHRcdFx0Y2FyZFNwYWNpbmdYID0gKChAdGFibGUud2lkdGggLSBAdGFibGUuY2FyZFdpZHRoKSAvIChAY2FyZHMubGVuZ3RoICsgMSkpIC8gQHRhYmxlLmNhcmRTaXplUmF0aW9cclxuXHRcdFx0Y2FyZFNwYWNpbmdZID0gQHRhYmxlLmNhcmRIZWlnaHQgKiAuNVxyXG5cdFx0XHRzaGlmdCA9IGNhcmRTcGFjaW5nWCAqIGlcclxuXHRcdFx0QGNhcmRTaGlmdHMucHVzaCBzaGlmdFxyXG5cdFx0XHRlbC5kYXRhICdjdXJyZW50VHJhbnNmb3JtJywgXCJ0I3tjYXJkU3BhY2luZ1ggKlxyXG5cdFx0XHRcdEB0YWJsZS5jYXJkU2l6ZVJhdGlvfVxyXG5cdFx0XHRcdCwje2NhcmRTcGFjaW5nWX1cclxuXHRcdFx0XHRzI3tAdGFibGUuY2FyZFNpemVSYXRpb30sMCwwXCJcclxuXHRcdFx0ZWwudHJhbnNmb3JtIGVsLmRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nXHJcblx0XHRcdG5leHRUcmFuc2Zvcm0gPSBcIiN7ZWwuZGF0YSAnY3VycmVudFRyYW5zZm9ybSd9dCN7c2hpZnR9LDBcIlxyXG5cdFx0XHRlbC5zdG9wKCkuYW5pbWF0ZSB0cmFuc2Zvcm06IG5leHRUcmFuc2Zvcm0sIDUwMCwgbWluYS5iYWNrb3V0XHJcblx0XHRcdGVsLmRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nLCBuZXh0VHJhbnNmb3JtXHJcblxyXG5DYXJkUm93Ojpob3ZlckluQ2FyZCA9IC0+XHJcblx0QHN0b3AoKS5hbmltYXRlIHRyYW5zZm9ybTogXCIje0BkYXRhICdjdXJyZW50VHJhbnNmb3JtJ310MFxyXG5cdCwjey0oQGRhdGEgJ2NhcmRSb3cnKS5wYWNrLmNhcmRIZWlnaHQgKiAuNH1cIiwgMjAwLCBtaW5hLmVsYXN0aWNcclxuXHJcbkNhcmRSb3c6OmhvdmVyT3V0Q2FyZCA9IC0+XHJcblx0QHN0b3AoKS5hbmltYXRlIHRyYW5zZm9ybTogXCIje0BkYXRhICdjdXJyZW50VHJhbnNmb3JtJ310MFxyXG5cdCwwXCIsIDIwMCwgbWluYS5iYWNrb3V0XHJcblxyXG5DYXJkUm93OjpkcmFnTW92ZUNhcmQgPSAoZHgsIGR5LCB4LCB5KSAtPlxyXG5cdGNhcmRSb3cgPSBAZGF0YSAnY2FyZFJvdydcclxuXHQjINC00LvRjyDQvtC00L3QvtGH0LDRgdC90L7RlyDRgNC+0LHQvtGC0Lgg0ZYgY2xpY2sn0YMg0ZYgZHJhZyfRgyDQtNC+0LLQtdC70L7RgdGPXHJcblx0IyDQstC40LrQvtGA0LjRgdGC0LDRgtC4INC/0L7QtNGW0Y4gbW91c2V1cCDQt9Cw0LzRltGB0YLRjCBjbGljaywg0LHQviDQvtC00YDQsNC30YNcclxuXHQjINC/0ZbRgdC70Y8g0L3QsNGC0LjRgdC60LDQvdC90Y8g0LzQuNGI0ZYg0L3QsCDQtdC70LXQvNC10L3RgtGWINC90LUg0ZQg0LfRgNC+0LfRg9C80ZbQu9C40LwsXHJcblx0IyDRh9C4INGG0LUg0LHRg9C00LUg0LrQu9GW0LosINGH0Lgg0YbQtSDQv9C+0YfQsNGC0L7QuiDQtNGA0LXQs9GDLlxyXG5cdCMg0J7QndCe0JLQm9CV0J3Qnjog0L3QsNCy0ZbRgtGMIG1vdXNldXAg0L3QtSDQs9C+0LTQuNGC0YzRgdGPLCDRgi7Rjy4g0LLRgdC1INC+0LTQvdC+XHJcblx0IyDRgdGC0LDRgNGC0YPRjtGC0Ywg0L/QvtC00ZbRlyDRliDQtNGA0LXQs9GDINGWINC60LvRltC60YMg0LrQvtC20L3QvtCz0L4g0YDQsNC30YMg0L/RgNC4XHJcblx0IyDQvdCw0YLQuNGB0LrQsNC90L3RliDQutC90L7Qv9C60Lgg0LzQuNGI0ZYuINCS0LjRgNGW0YjQuNCyINCy0LjQutC+0YDQuNGB0YLQsNGC0Lgg0L7QsdGA0L4tXHJcblx0IyDQsdC70Y7QstCw0YfRliDRgtGW0LvRjNC60Lgg0LTQu9GPINC00YDQtdCz0YMuINCQ0LvQs9C+0YDQuNGC0Lwg0YLQsNC60LjQuTpcclxuXHQjINC/0ZbRgdC70Y8g0L3QsNGC0LjRgdC60LDQvdC90Y8g0LrQvdC+0L/QutC4INC80LjRiNGWINC+0LTRgNCw0LfRgyDQvtGC0YDQuNC80YPRlNC80L4g0LXQu9C1LVxyXG5cdCMg0LzQtdC90YIgLSBtb3VzZURvd25DYXJkO1xyXG5cdCMg0Y/QutGJ0L4g0L/RltGB0LvRjyDQvdCw0YLQuNGB0LrQsNC90L3RjyDRliDQtNC+INCy0ZbQtNC/0YPRgdC60LDQvdC90Y8g0LrQvdC+0L/QutC4INC80LjRiNGWXHJcblx0IyDQt9C80ZbQvdC40LvQvtGB0Y8gZHgg0LDQsdC+IGR5IC0g0LfQvdCw0YfQuNGC0Ywg0YbQtSDQtNGA0LXQsywgbW91c2VEb3duQ2FyZFxyXG5cdCMg0L7QtNGA0LDQt9GDINCy0LjQtNCw0LvRj9GU0YLRjNGB0Y8sINC60LvQvtC9INC00LvRjyDQtNGA0LXQs9GDINGB0YLQstC+0YDRjtGU0YLRjNGB0Y9cclxuXHQjINC30LAg0L/RgNC40YfQuNC90Lgg0L3QtdC80L7QttC70LjQstC+0YHRgtGWINC30LzRltC90LjRgtC4IHot0ZbQvdC00LXQutGBINC10LvQtdC80LXQvdGC0LAg0L/RgNC4XHJcblx0IyDQv9C10YDQtdGC0Y/Qs9GD0LLQsNC90L3Rliwg0YLQvtCx0YLQviDQutCw0YDRgtCwINGA0YPRhdCw0ZTRgtGM0YHRjyBcItC30LBcIiDRltC90YjQuNC80LgsXHJcblx0IyDQv9GW0LfQvdGW0YjQtSDQtNC+0LTQsNC90LjQvNC4LCDQsCDRgtCw0LrQvtC2INC30LAg0LrQsNGA0YLQsNC80Lgg0YDRg9C6LCDRidC+LCDQv9C+LdC/0LXRgNGI0LUsXHJcblx0IyDQvdC1INC10YHRgtC10YLQuNGH0L3Qviwg0LAsINC/0L4t0LTRgNGD0LPQtSwg0LLQuNC60LvQuNC60LDRlCDRgNGW0LfQvdGWINC/0L7QtNGW0Zcg0LzQuNGI0ZYuXHJcblx0IyDQvtGB0L3QvtCy0L3QuNC5INC10LvQtdC80LXQvdGCINC90LAg0YfQsNGBINGC0Y/Qs9Cw0L3QvdGPINC60LvQvtC90LAg0YDQvtCx0LjRgtGM0YHRjyDQvdC10LLQuNC00LjQvNC40LxcclxuXHJcblx0aWYgIWNhcmRSb3cudGFibGUuZHJhZ0Nsb25lIGFuZCAoZHggb3IgZHkpXHJcblx0XHRjYXJkUm93LnRhYmxlLmRyYWdDbG9uZSA9IEBjbG9uZSgpXHJcblx0XHQjINGP0LrRidC+INC/0L7Rh9Cw0LLRgdGPINC00YDQtdCzLCDQstCy0LDQttCw0ZTQvNC+LCDRidC+INGG0LUg0LLQttC1INGC0L7Rh9C90L4g0L3QtSDQutC70ZbQulxyXG5cdFx0IyBlaXRoZXIgZHJhZ0Nsb25lIG9yIG1vdXNlRG93bkNhcmQgbWF5IGV4aXN0XHJcblx0XHRjYXJkUm93LnRhYmxlLm1vdXNlRG93bkNhcmQgPSBudWxsXHJcblx0XHRjYXJkUm93LnRhYmxlLnNuYXBBcmVhLmFkZCBjYXJkUm93LnRhYmxlLmRyYWdDbG9uZVxyXG5cdFx0QGF0dHIgdmlzaWJpbGl0eTogJ2hpZGRlbidcclxuXHRcdCMgc2hvdyBmYW4gZnJhbWVzIG9ubHkgd2hlbiBkcmFnIG1vdmVtZW50IHN0YXJ0c1xyXG5cdFx0Zm9yIG5hbWUsIGhhbmQgb2YgY2FyZFJvdy50YWJsZS5oYW5kc1xyXG5cdFx0XHRoYW5kLmZhbkZyYW1lLmF0dHIgdmlzaWJpbGl0eTogJ3Zpc2libGUnXHJcblx0Y2FyZFJvdy50YWJsZS5kcmFnQ2xvbmU/LnRyYW5zZm9ybSBcInRcXFxyXG5cdCN7eCAtIGNhcmRSb3cudGFibGUucGFjay5jYXJkV2lkdGggLyAyIH1cclxuXHQsI3t5IC0gY2FyZFJvdy50YWJsZS5wYWNrLmNhcmRIZWlnaHQgLyAyIH1cXFxyXG5cdHMje2NhcmRSb3cudGFibGUuY2FyZFNpemVSYXRpb31cIlxyXG5cclxuQ2FyZFJvdzo6ZHJhZ1N0YXJ0Q2FyZCA9IC0+XHJcblx0Y2FyZFJvdyA9IEBkYXRhICdjYXJkUm93J1xyXG5cdGNhcmRSb3cudGFibGUubW91c2VEb3duQ2FyZCA9IEAgIyBuZWVkZWQgZm9yIHRyYWNraW5nIFwiY2xpY2tcIlxyXG5cdGNhcmRSb3cudW5TZXRIb3ZlcnMoKVxyXG5cdGZvciBuYW1lLCBoYW5kIG9mIGNhcmRSb3cudGFibGUuaGFuZHNcclxuXHRcdGhhbmQudW5TZXRIb3ZlcnMoKVxyXG5cclxuQ2FyZFJvdzo6ZHJhZ0VuZENhcmQgPSAoZSkgLT5cclxuXHRjYXJkID0gQFxyXG5cdGNhcmRSb3cgPSBAZGF0YSAnY2FyZFJvdydcclxuXHR1bmxlc3MgY2FyZFJvdy50YWJsZS5kcmFnQ2xvbmUgIyB0aGVyZSBoYXMgYmVlbiBubyBkcmFnXHJcblx0XHQjIGFuZCBjbGljayB3YXMgbm90IG1hZGUgZWxzZXdoZXJlXHJcblx0XHRpZiBAIGlzIGNhcmRSb3cudGFibGUubW91c2VEb3duQ2FyZFxyXG5cdFx0XHRjdXJyZW50SGFuZCA9ICd3ZXN0J1xyXG5cdFx0XHRpZiBlLmN0cmxLZXlcclxuXHRcdFx0XHRpZiBlLnNoaWZ0S2V5XHJcblx0XHRcdFx0XHRjdXJyZW50SGFuZCA9ICdlYXN0J1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGN1cnJlbnRIYW5kID0gJ3NvdXRoJ1xyXG5cdFx0XHQjIGlmIGNhcmRSb3cudGFibGUuaGFuZHNbXCIje2N1cnJlbnRIYW5kfVwiXS5jYXJkcy5sZW5ndGggPCAxMFxyXG5cdFx0XHRwaWNrZWQgPSBjYXJkUm93LmNhcmRzLnNwbGljZSAoQGRhdGEgJ3Jvd0luZGV4JyksIDFcclxuXHRcdFx0IyBhbmluQ2xvbmUgLSDRhtC1INC60L7Qv9GW0Y8g0LrQsNGA0YLQuCwg0Y/QutCwINCy0LjQtNCw0LvRj9GU0YLRjNGB0Y8g0ZbQtyDRgNGP0LTRgyxcclxuXHRcdFx0IyDQtNC70Y8g0YHQuNC80YPQu9GP0YbRltGXINGA0YPRhdGDINC/0L4g0YHRgtC+0LvRgyDQstGW0LQg0YDRj9C00YMg0LTQviDRgNGD0LrQuFxyXG5cdFx0XHQjINC80L7QttC90LAsINC30LLQuNGH0LDQudC90L4sINCy0LjQutC+0YDQuNGB0YLQsNGC0Lgg0L3QtSDQutC70L7QvSwg0LAg0L/QvtGC0L7Rh9C90LjQuVxyXG5cdFx0XHQjINC10LrQt9C10LzQv9C70Y/RgCwg0LDQu9C1INCy0ZbQvSDQsNC90ZbQvNGD0ZTRgtGM0YHRjyBcItC/0ZbQtFwiINC60LDRgNGC0Lgg0YDRg9C60LgsXHJcblx0XHRcdCMg0YnQviDQvdC1INC00YPQttC1INC10YHRgtC10YLQuNGH0L3QvlxyXG5cdFx0XHRhbmltQ2xvbmUgPSBAY2xvbmUoKVxyXG5cdFx0XHRAcmVtb3ZlKClcclxuXHRcdFx0IyDQsdC10Lcg0YbRjNC+0LPQviDRgNGP0LTQutCwINC60LvQvtC9INC00L7QtNCw0ZTRgtGM0YHRjyBcItC/0ZbQtFwiINGA0Y/QtCDRliDRgNGD0LrRg1xyXG5cdFx0XHRjYXJkUm93LnRhYmxlLnNuYXBBcmVhLmFkZCBhbmltQ2xvbmVcclxuXHRcdFx0YW5pbVRvSGFuZCA9IFwidCN7Y2FyZFJvdy50YWJsZS5jb29yZHNbY3VycmVudEhhbmRdLnh9LFxyXG5cdFx0XHRcdCN7Y2FyZFJvdy50YWJsZS5jb29yZHNbY3VycmVudEhhbmRdLnl9XHJcblx0XHRcdFx0cyN7Y2FyZFJvdy50YWJsZS5jYXJkU2l6ZVJhdGlvfSwwLDBcIlxyXG5cdFx0XHRhbmltQ2xvbmUuc3RvcCgpLmFuaW1hdGUgdHJhbnNmb3JtOiBhbmltVG9IYW5kLCAxODAsIG1pbmEuYmFja291dFxyXG5cdFx0XHRzZXRUaW1lb3V0ICgtPlxyXG5cdFx0XHRcdGFuaW1DbG9uZS5yZW1vdmUoKVxyXG5cdFx0XHRcdHBpY2tlZFswXS5oYW5kID0gY3VycmVudEhhbmQgIyBBVFRFTlRJT04hISFcclxuXHRcdFx0XHRzZWxlY3RlZEhhbmQgPSBjYXJkUm93LnRhYmxlLmhhbmRzW1wiI3tjdXJyZW50SGFuZH1cIl1cclxuXHRcdFx0XHRzZWxlY3RlZEhhbmQuY2FyZHMucHVzaCBwaWNrZWRbMF1cclxuXHRcdFx0XHRjYXJkUm93LnJlbmRlckNhcmRSb3coKVxyXG5cdFx0XHRcdHNlbGVjdGVkSGFuZC5yZW5kZXJIYW5kKClcclxuXHRcdFx0XHRmb3IgbmFtZSwgdGFibGVIYW5kIG9mIGNhcmRSb3cudGFibGUuaGFuZHNcclxuXHRcdFx0XHRcdHRhYmxlSGFuZC5zZXRIb3ZlcnMoKVxyXG5cdFx0XHRcdHNlbGVjdGVkSGFuZC5zZXREcmFncygpXHJcblx0XHRcdFx0KSwgMjAwXHJcblx0ZWxzZVxyXG5cdFx0Zm9yIG5hbWUsIGhhbmQgb2YgY2FyZFJvdy50YWJsZS5oYW5kc1xyXG5cdFx0XHRpZiBTbmFwLnBhdGguaXNQb2ludEluc2lkZSBoYW5kLmZhbkZyYW1lUGF0aCwgZS5wYWdlWCwgZS5wYWdlWVxyXG5cdFx0XHRcdHNlbGVjdGVkSGFuZCA9IGhhbmRcclxuXHRcdFx0XHRicmVha1xyXG5cdFx0aWYgc2VsZWN0ZWRIYW5kXHJcblx0XHRcdHBpY2tlZCA9IGNhcmRSb3cuY2FyZHMuc3BsaWNlIChAZGF0YSAncm93SW5kZXgnKSwgMVxyXG5cdFx0XHRwaWNrZWRbMF0uaGFuZCA9IHNlbGVjdGVkSGFuZC5zZWF0XHJcblx0XHRcdHNlbGVjdGVkSGFuZC5jYXJkcy5wdXNoIHBpY2tlZFswXVxyXG5cdFx0XHRjYXJkUm93LnRhYmxlLmRyYWdDbG9uZS5yZW1vdmUoKVxyXG5cdFx0XHRjYXJkUm93LnRhYmxlLmRyYWdDbG9uZSA9IG51bGxcclxuXHRcdFx0Y2FyZFJvdy5yZW5kZXJDYXJkUm93KClcclxuXHRcdFx0c2VsZWN0ZWRIYW5kLnJlbmRlckhhbmQoKVxyXG5cdFx0XHRmb3IgbmFtZSwgdGFibGVIYW5kIG9mIGNhcmRSb3cudGFibGUuaGFuZHNcclxuXHRcdFx0XHR0YWJsZUhhbmQuc2V0SG92ZXJzKClcclxuXHRcdFx0XHR0YWJsZUhhbmQuc2V0RHJhZ3MoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBjYXJkUm93LnRhYmxlLmRyYWdDbG9uZVxyXG5cdFx0XHRcdGNhcmRSb3cudGFibGUuZHJhZ0Nsb25lLnN0b3AoKVxyXG5cdFx0XHRcdC5hbmltYXRlIHRyYW5zZm9ybTogXCIje0BkYXRhICdjdXJyZW50VHJhbnNmb3JtJ310MCwwXCJcclxuXHRcdFx0XHQsIDQwMCwgbWluYS5iYWNrb3V0XHJcblx0XHRcdFx0c2V0VGltZW91dCAoLT5cclxuXHRcdFx0XHRcdGNhcmRSb3cudGFibGUuZHJhZ0Nsb25lLnJlbW92ZSgpXHJcblx0XHRcdFx0XHRjYXJkUm93LnRhYmxlLmRyYWdDbG9uZSA9IG51bGxcclxuXHRcdFx0XHRcdGNhcmQudHJhbnNmb3JtIFwiI3tjYXJkLmRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nfXQwLDBcIlxyXG5cdFx0XHRcdFx0Y2FyZC5hdHRyIHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xyXG5cdFx0XHRcdFx0IyBjYXJkUm93LnRhYmxlLm1vdXNlRG93bkNhcmQgPSBudWxsXHJcblx0XHRcdFx0XHRjYXJkUm93LnNldEhvdmVycygpXHJcblx0XHRcdFx0XHQpLCA0MDFcclxuXHJcblx0Zm9yIG5hbWUsIGhhbmQgb2YgY2FyZFJvdy50YWJsZS5oYW5kc1xyXG5cdFx0aGFuZC5mYW5GcmFtZS5hdHRyIHZpc2liaWxpdHk6ICdoaWRkZW4nXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhcmRSb3ciLCJyZXF1aXJlICcuL2FycmF5LXV0aWxzJ1xyXG51dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMnXHJcblRyaWNrID0gcmVxdWlyZSAnLi9UcmljaydcclxuXHJcbmNsYXNzIEhhbmRcclxuXHRjb25zdHJ1Y3RvcjogKEB0b29sQmFyLCBAdGFibGUsIEBwYWNrLCBAc2VhdCwgQGNhcmRzLCBAaXNCbGluZCwgQGlzV2lkb3cpIC0+XHJcblx0XHRAc2hpZnRBbmdsZSA9IDEyXHJcblx0XHQjINCy0LjQv9Cw0LTQutC+0LLQtSDRgdC+0YDRgtGD0LLQsNC90L3RjyDQt9CwINC30YDQvtGB0YLQsNC90L3Rj9C8INCw0LHQviDRg9Cx0YPQstCw0L3QvdGP0LxcclxuXHRcdCMg0L3QvtC80ZbQvdCw0LvRgyDQutCw0YDRgtC4INC90LAg0L/QtdGA0ZbQvtC0IFwi0LbQuNGC0YLRj1wiINGA0YPQutC4XHJcblx0XHQjINC00L4g0YbRjNC+0LPQviDQsdGD0LvQviDRgyBAZ2V0U29ydE9yZGVycygpINGC0LXQv9C10YAg0YLQsNC8INGC0ZbQu9GM0LrQuFxyXG5cdFx0IyDRgdC+0YDRgtGD0LLQsNC90L3RjyDQt9CwINC80LDRgdGC0Y/QvNC4XHJcblx0XHRpZiBNYXRoLmZsb29yIE1hdGgucmFuZG9tKCkgKiAyXHJcblx0XHRcdGFyciA9IEBwYWNrLnNvcnRWYWx1ZXMuc2xpY2UoKVxyXG5cdFx0XHRAcmFuRGlyZWN0aW9uVmFsdWVzID0gYXJyLnJldmVyc2UoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRAcmFuRGlyZWN0aW9uVmFsdWVzID0gQHBhY2suc29ydFZhbHVlc1xyXG5cclxuXHRcdEBmYW5GcmFtZSA9IEB0YWJsZS5zbmFwQXJlYS5wYXRoIFwiXCJcclxuXHRcdEByZW5kZXJGYW5GcmFtZSgpXHJcblx0XHRAZ3JhZCA9IEB0YWJsZS5zbmFwQXJlYS5ncmFkaWVudCBcInIoLjUsLjUsLjk1KSMwMGYtI2ZmZlwiXHJcblx0XHRAYmx1ckZpbHRlciA9IEB0YWJsZS5zbmFwQXJlYS5maWx0ZXIgU25hcC5maWx0ZXIuYmx1ciAyLCAyXHJcblxyXG5cdFx0QGZhbkZyYW1lLmF0dHIgc3Ryb2tlV2lkdGg6IDQsIHN0cm9rZTogJ2dyZWVuJ1xyXG5cdFx0LCBmaWx0ZXI6IEBibHVyRmlsdGVyLCBvcGFjaXR5OiAuMywgZmlsbDogJ3RyYW5zcGFyZW50J1xyXG5cdFx0LCB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xyXG5cdFx0IyBsb3JlbSA9IFwiU2NvdHQgR2xlbm4gd2FzIGJvcm4gSmFudWFyeSAyNiwgMTk0MSwgaW4gUGl0dHNidXJnaCwgUGVubnN5bHZhbmlhLCB0byBFbGl6YWJldGggYW5kIFRoZW9kb3JlIEdsZW5uLCBhIHNhbGVzbWFuLiBBcyBoZSBncmV3IHVwIGluIEFwcGFsYWNoaWEsIGhpcyBoZWFsdGggd2FzIHBvb3I7IGhlIHdhcyBiZWRyaWRkZW4gZm9yIGEgeWVhciBhbmQgZG9jdG9ycyBwcmVkaWN0ZWQgaGUgd291bGQgbGltcCBmb3IgdGhlIHJlc3Qgb2YgaGlzIGxpZmUuIER1cmluZyBsb25nIHBlcmlvZHMgb2YgaWxsbmVzcywgR2xlbm4gd2FzIHJlYWRpbmcgYSBsb3QgYW5kICdkcmVhbWluZyBvZiBiZWNvbWluZyBMb3JkIEJ5cm9uJ1wiXHJcblx0XHQjIGNhcHRpb24gPSBAdGFibGUuc25hcEFyZWEudGV4dCA1MCwgNTAsIGxvcmVtXHJcblx0XHQjIGNhcHRpb24uYXR0ciB0ZXh0cGF0aDogQGZhbkZyYW1lUGF0aFxyXG5cclxuXHRcdEBoYW5kQ2FyZHNDb3VudGVyID0gQHRhYmxlLnNuYXBBcmVhLnRleHQgMCwgMCwgXCJcIlxyXG5cdFx0QGhhbmRDYXJkc0NvdW50ZXIuYXR0ciBmaWxsOiAnd2hpdGUnLCAndGV4dC1hbmNob3InOiAnbWlkZGxlJ1xyXG5cdFx0XHQjIC5hZGRDbGFzcyAnY2FyZHNDb3VudGVyJ1xyXG5cclxuXHRcdEBjYXJkcyA9IFtdXHJcblx0XHRAaGFuZEdyb3VwID0gW11cclxuXHRcdEB0cmlja3MgPSBbXVxyXG5cdFx0QHRyaWNrc0dyb3VwID0gW11cclxuXHRcdEByZW5kZXJIYW5kKClcclxuXHJcbkhhbmQ6OnJlbmRlckZhbkZyYW1lID0gLT5cclxuXHR2YWx1ZXMgPSBAdGFibGUuY29vcmRzW1wiI3tAc2VhdH1cIl1cclxuXHRAZmFuRnJhbWVQYXRoID0gdXRpbHMuZGVzY3JpYmVTZWN0b3IgdmFsdWVzLnNlY3RvckZhblhcclxuXHQsIHZhbHVlcy5zZWN0b3JGYW5ZXHJcblx0LCBAdGFibGUuY29vcmRzLmZhbklubmVyUiwgQHRhYmxlLmNvb3Jkcy5mYW5PdXRlclJcclxuXHQsIC1Ac2hpZnRBbmdsZSAqIDMuOCwgQHNoaWZ0QW5nbGUgKiAzLjhcclxuXHJcblx0QGZhbkZyYW1lLmF0dHIgZDogQGZhbkZyYW1lUGF0aFxyXG5cclxuSGFuZDo6Z2V0VHJpY2tDb29yZHMgPSAoaW5kZXgpIC0+XHJcblx0c3RhcnRYID0gQHRhYmxlLmNvb3Jkc1tAc2VhdF0ueFxyXG5cdHN0YXJ0WSA9IEB0YWJsZS5jb29yZHNbQHNlYXRdLnlcclxuXHRoZWlnaHQgPSBAdGFibGUuY2FyZEhlaWdodFxyXG5cdHdpZHRoID0gQHRhYmxlLmNhcmRXaWR0aFxyXG5cdHNpemUgPSBoZWlnaHQgLSB3aWR0aFxyXG5cdCMgb2Zmc2V0ID0gaGVpZ2h0ICogLjJcclxuXHRvZmZzZXQgPSAwXHJcblx0IyBnZXR0aW5nIGNhcmQgcmlnaHQgdHJpYW5nbGVcclxuXHRhbmdsZSA9IFNuYXAuZGVnIE1hdGguYXRhbiB3aWR0aCAvIGhlaWdodFxyXG5cdCMgZ2V0dGluZyB0aGUgaHlwb3RlbnVzZVxyXG5cdGh5cG8gPSAoTWF0aC5zcXJ0ICgoTWF0aC5wb3cgd2lkdGgsIDIpICsgKE1hdGgucG93IGhlaWdodCwgMikpKSAvIDJcclxuXHRjb29yZHMgPSBbXSAjIGZpcnN0IHR3byBhcmUgY3ggYW5kIGN5IG9mIHRoZSBsYXN0IHRyaWNrLCB0aGlyZCBpcyB0cnN0clxyXG5cdGlmIEBzZWF0IGlzICdzb3V0aCcgIyBob3Jpem9udGFsIHBsYWNlbWVudFxyXG5cdFx0eFNoaWZ0ID0gaHlwbyAqIE1hdGguY29zIFNuYXAucmFkICgtYW5nbGUgLSA5MCArIDQ1KVxyXG5cdFx0c2hpZnQgPSBpbmRleCAqIDIgKiAoeFNoaWZ0ICsgb2Zmc2V0KVxyXG5cdFx0dW5sZXNzIGluZGV4ICUgMlxyXG5cdFx0XHR0ciA9IFwicyN7QHRhYmxlLmNhcmRTaXplUmF0aW99LCN7QHRhYmxlLmNhcmRTaXplUmF0aW99XFxcclxuXHRcdFx0cjQ1VCN7c3RhcnRYICsgc2hpZnR9LCN7c3RhcnRZfVwiXHJcblx0XHRlbHNlXHJcblx0XHRcdHRyID0gXCJzI3tAdGFibGUuY2FyZFNpemVSYXRpb30sI3tAdGFibGUuY2FyZFNpemVSYXRpb31cXFxyXG5cdFx0XHRyLTQ1VCN7c3RhcnRYICsgc2hpZnR9LCN7c3RhcnRZfVwiXHJcblx0XHRjb29yZHMucHVzaCAoc3RhcnRYICsgc2hpZnQgKyBAcGFjay5jYXJkV2lkdGggLyAyKVxyXG5cdFx0Y29vcmRzLnB1c2ggKHN0YXJ0WSArIEBwYWNrLmNhcmRIZWlnaHQgLyAyKVxyXG5cdGVsc2UgIyB2ZXJ0aWNhbCBwbGFjZW1lbnRcclxuXHRcdHlTaGlmdCA9IGh5cG8gKiBNYXRoLnNpbiBTbmFwLnJhZCAoLTI3MCArIGFuZ2xlICsgNDUpXHJcblx0XHRzaGlmdCA9IGluZGV4ICogMiAqICh5U2hpZnQgKyBvZmZzZXQpXHJcblx0XHR1bmxlc3MgaW5kZXggJSAyXHJcblx0XHRcdHRyID0gXCJzI3tAdGFibGUuY2FyZFNpemVSYXRpb30sI3tAdGFibGUuY2FyZFNpemVSYXRpb31cXFxyXG5cdFx0XHRyNDVUI3tzdGFydFh9LCN7c3RhcnRZICsgc2hpZnR9XCJcclxuXHRcdGVsc2VcclxuXHRcdFx0dHIgPSBcInMje0B0YWJsZS5jYXJkU2l6ZVJhdGlvfSwje0B0YWJsZS5jYXJkU2l6ZVJhdGlvfVxcXHJcblx0XHRcdHItNDVUI3tzdGFydFh9LCN7c3RhcnRZICsgc2hpZnR9XCJcclxuXHRcdGNvb3Jkcy5wdXNoIChzdGFydFggKyBAcGFjay5jYXJkV2lkdGggLyAyKVxyXG5cdFx0Y29vcmRzLnB1c2ggKHN0YXJ0WSArIHNoaWZ0ICsgQHBhY2suY2FyZEhlaWdodCAvIDIpXHJcblx0Y29vcmRzLnB1c2ggdHJcclxuXHRjb29yZHNcclxuXHJcbkhhbmQ6OnJlbmRlclRyaWNrcyA9IC0+XHJcblx0aWYgQHRyaWNrc0dyb3VwLmxlbmd0aFxyXG5cdFx0Zm9yIHQgaW4gQHRyaWNrc0dyb3VwXHJcblx0XHRcdHQucmVtb3ZlKClcclxuXHRcdEB0cmlja3NHcm91cCA9IFtdXHJcblxyXG5cdGlmIEB0cmlja3MubGVuZ3RoXHJcblx0XHRmb3IgdHJpY2ssIGkgaW4gQHRyaWNrc1xyXG5cdFx0XHRiYWNrR3JvdXAgPSBAdGFibGUuc25hcEFyZWEuZygpLmF0dHIgdmlzaWJpbGl0eTonaGlkZGVuJ1xyXG5cdFx0XHRiYWNrID0gQHRhYmxlLnNuYXBBcmVhLmcoKS5hZGQgQHBhY2suYmFja0JsdWUuY2xvbmUoKVxyXG5cdFx0XHRiYWNrR3JvdXAuYWRkIGJhY2tcclxuXHJcblx0XHRcdHRyQXJyID0gQGdldFRyaWNrQ29vcmRzIGlcclxuXHRcdFx0YmFjay50cmFuc2Zvcm0gdHJBcnJbMl1cclxuXHJcblx0XHRcdGlmIGkgaXMgKEB0cmlja3MubGVuZ3RoIC0gMSkgIyB0aGUgbGFzdCB0cmlja1xyXG5cdFx0XHRcdHNpemUgPSBAdGFibGUuY2FyZEhlaWdodCAtIEB0YWJsZS5jYXJkV2lkdGhcclxuXHRcdFx0XHRjaXJjbGUgPSBAdGFibGUuc25hcEFyZWEuY2lyY2xlIDAsMFxyXG5cdFx0XHRcdCwgKEB0YWJsZS5jYXJkSGVpZ2h0IC0gQHRhYmxlLmNhcmRXaWR0aCkgKiAuNlxyXG5cdFx0XHRcdFx0LmF0dHIgZmlsbDogJ3doaXRlJywgc3Ryb2tlOiAnYmxhY2snLCBzdHJva2VXaWR0aDogMVxyXG5cdFx0XHRcdG51bWJlciA9IEB0YWJsZS5zbmFwQXJlYS50ZXh0IDAsIHNpemUgKiAuOCAvIDIsIGkgKyAxXHJcblx0XHRcdFx0XHQuYXR0ciBmaWxsOidibGFjaycsICdmb250LXNpemUnOiBzaXplICogLjhcclxuXHRcdFx0XHRcdCwgJ3RleHQtYW5jaG9yJzogJ21pZGRsZSdcclxuXHJcblx0XHRcdFx0IyBhbGlnbmluZyBudW1iZXIgb2YgdHJpY2tzIHZlcnRpY2FsbHlcclxuXHRcdFx0XHRib3ggPSBudW1iZXIuZ2V0QkJveCgpXHJcblx0XHRcdFx0YWxpZ25UciA9IFwidDAsLSN7Ym94LnkgKyBib3guaCAvIDJ9XCJcclxuXHJcblx0XHRcdFx0bGFzdFRyaWNrQ2VudGVyID0gXCJ0I3t0ckFyclswXX0sI3t0ckFyclsxXX1cIlxyXG5cdFx0XHRcdGNpcmNsZS50cmFuc2Zvcm0gbGFzdFRyaWNrQ2VudGVyXHJcblx0XHRcdFx0bnVtYmVyLnRyYW5zZm9ybSBcIiN7bGFzdFRyaWNrQ2VudGVyfSN7YWxpZ25Ucn1cIlxyXG5cdFx0XHRcdGJhY2tHcm91cC5hZGQgY2lyY2xlLCBudW1iZXJcclxuXHJcblx0XHRcdGJhY2tHcm91cC5hdHRyIHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xyXG5cclxuXHRcdFx0QHRyaWNrc0dyb3VwLnB1c2ggYmFja0dyb3VwXHJcblxyXG5IYW5kOjpnZXRTb3J0T3JkZXJzID0gLT5cclxuXHRzYW1lQ29sb3JzID0gWydkJywgJ2gnXVxyXG5cdGN1cnJlbnRTdWl0cyA9IChjYXJkLnN1aXQgZm9yIGNhcmQgaW4gQGNhcmRzKVxyXG5cdHVuaXF1ZVN1aXRzID0gY3VycmVudFN1aXRzLnVuaXF1ZSgpXHJcblx0QHNvcnRlZFVuaXF1ZVN1aXRzID0gW11cclxuXHJcblx0aWYgdW5pcXVlU3VpdHMubGVuZ3RoIDw9IDJcclxuXHRcdEBzb3J0ZWRVbmlxdWVTdWl0cyA9IHVuaXF1ZVN1aXRzXHJcblx0ZWxzZVxyXG5cdFx0Y2hlY2tzID0gKHNhbWVDb2xvcnMuZXhpc3RzIHN1aXQgZm9yIHN1aXQgaW4gdW5pcXVlU3VpdHMpXHJcblx0XHRpZiBjaGVja3NbMF0gaXMgbm90IGNoZWNrc1sxXVxyXG5cdFx0XHRpZiBjaGVja3NbMV0gaXMgbm90IGNoZWNrc1syXVxyXG5cdFx0XHRcdEBzb3J0ZWRVbmlxdWVTdWl0cyA9IHVuaXF1ZVN1aXRzXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRAc29ydGVkVW5pcXVlU3VpdHMucHVzaCB1bmlxdWVTdWl0c1sxXSwgdW5pcXVlU3VpdHNbMF0sIHVuaXF1ZVN1aXRzWzJdLCB1bmlxdWVTdWl0c1szXVxyXG5cdFx0XHRcdCMgQHNvcnRlZFVuaXF1ZVN1aXRzLnB1c2ggdW5pcXVlU3VpdHNbM10gaWYgdW5pcXVlU3VpdHMubGVuZ3RoIGlzIDRcclxuXHRcdGVsc2VcclxuXHRcdFx0QHNvcnRlZFVuaXF1ZVN1aXRzLnB1c2ggdW5pcXVlU3VpdHNbMF0sIHVuaXF1ZVN1aXRzWzJdLCB1bmlxdWVTdWl0c1sxXSwgdW5pcXVlU3VpdHNbM11cclxuXHRcdFx0IyBAc29ydGVkVW5pcXVlU3VpdHMucHVzaCB1bmlxdWVTdWl0c1szXSBpZiB1bmlxdWVTdWl0cy5sZW5ndGggaXMgNFxyXG5cclxuSGFuZDo6Z2V0QWxsb3dlZFN1aXQgPSAoY3VycmVudFN1aXQpIC0+XHJcblx0QGFsbG93ZWRTdWl0ID0gbnVsbFxyXG5cdGlmIEB0YWJsZS5hcHBNb2RlIGlzICdtb3ZpbmcnXHJcblx0XHRoYW5kU3VpdHMgPSAoY2FyZC5zdWl0IGZvciBjYXJkIGluIEBjYXJkcylcclxuXHRcdHVuaXF1ZUhhbmRTdWl0cyA9IGhhbmRTdWl0cy51bmlxdWUoKVxyXG5cdFx0aWYgdW5pcXVlSGFuZFN1aXRzLmV4aXN0cyBjdXJyZW50U3VpdFxyXG5cdFx0XHRAYWxsb3dlZFN1aXQgPSBjdXJyZW50U3VpdFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiB1bmlxdWVIYW5kU3VpdHMuZXhpc3RzIEB0YWJsZS5kZWFsLnRydW1wXHJcblx0XHRcdFx0QGFsbG93ZWRTdWl0ID0gQHRhYmxlLmRlYWwudHJ1bXBcclxuXHJcbkhhbmQ6OnNldEhvdmVycyA9IChjdXJyZW50U3VpdCkgLT5cclxuXHRpZiBjdXJyZW50U3VpdCBhbmQgQHRhYmxlLmFwcE1vZGUgaXMgJ21vdmluZydcclxuXHRcdGxhc3RUcmljayA9IEB0YWJsZS5kZWFsLnRyaWNrc1soQHRhYmxlLmRlYWwudHJpY2tzLmxlbmd0aCAtIDEpXVxyXG5cdFx0aWYgbGFzdFRyaWNrLmNhcmRzLmxlbmd0aCBpcyAxXHJcblx0XHRcdEBnZXRBbGxvd2VkU3VpdCBjdXJyZW50U3VpdCAjINC00L7RgdGC0LDRgtC90YzQviDQt9GA0L7QsdC40YLQuCDQvtC00LjQvSDRgNCw0Lcg0LTQu9GPINGA0YPQutC4INC/0ZbRgdC70Y8gMS3Qs9C+INGF0L7QtNGDXHJcblx0Zm9yIGVsIGluIEBoYW5kR3JvdXBcclxuXHRcdHVubGVzcyAoQGFsbG93ZWRTdWl0IGFuZCAoZWwuZGF0YSAnc3VpdCcpIGlzbnQgQGFsbG93ZWRTdWl0KVxyXG5cdFx0XHRlbC5ob3ZlciBAaG92ZXJJbkNhcmQsIEBob3Zlck91dENhcmRcclxuXHJcbkhhbmQ6OnVuU2V0SG92ZXJzID0gLT5cclxuXHRmb3IgZWwgaW4gQGhhbmRHcm91cFxyXG5cdFx0ZWwudW5ob3ZlciBAaG92ZXJJbkNhcmQsIEBob3Zlck91dENhcmRcclxuXHJcbkhhbmQ6OnNldERyYWdzID0gLT5cclxuXHQjIGlmIEB0YWJsZS5hcHBNb2RlIGlzICdkZWFsaW5nJ1xyXG5cdGZvciBlbCBpbiBAaGFuZEdyb3VwXHJcblx0XHR1bmxlc3MgKEBhbGxvd2VkU3VpdCBhbmQgKGVsLmRhdGEgJ3N1aXQnKSBpc250IEBhbGxvd2VkU3VpdClcclxuXHRcdFx0ZWwuZHJhZyBAZHJhZ01vdmVDYXJkLCBAZHJhZ1N0YXJ0Q2FyZCwgQGRyYWdFbmRDYXJkXHJcblxyXG5IYW5kOjp1blNldERyYWdzID0gLT5cclxuXHRmb3IgZWwgaW4gQGhhbmRHcm91cFxyXG5cdFx0ZWwudW5kcmFnKClcclxuXHJcbkhhbmQ6OmhvdmVySW5DYXJkID0gLT5cclxuXHRAc3RvcCgpLmFuaW1hdGUgdHJhbnNmb3JtOiBcIiN7QGRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nfXQwXHJcblx0LCN7LShAZGF0YSAnaGFuZCcpLnBhY2suY2FyZEhlaWdodCAqIC40fVwiLCAyMDAsIG1pbmEuZWxhc3RpY1xyXG5cclxuSGFuZDo6aG92ZXJPdXRDYXJkID0gLT5cclxuXHRAc3RvcCgpLmFuaW1hdGUgdHJhbnNmb3JtOiBcIiN7QGRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nfXQwXHJcblx0LDBcIiwgMjAwLCBtaW5hLmJhY2tvdXRcclxuXHJcbkhhbmQ6OmRyYWdNb3ZlQ2FyZCA9IChkeCwgZHksIHgsIHkpIC0+XHJcblx0aGFuZCA9IEBkYXRhICdoYW5kJ1xyXG5cdGlmICFoYW5kLnRhYmxlLmRyYWdDbG9uZSBhbmQgKGR4IG9yIGR5KVxyXG5cdFx0aGFuZC50YWJsZS5kcmFnQ2xvbmUgPSBAY2xvbmUoKVxyXG5cdFx0aGFuZC50YWJsZS5tb3VzZURvd25DYXJkID0gbnVsbFxyXG5cdFx0aGFuZC50YWJsZS5zbmFwQXJlYS5hZGQgaGFuZC50YWJsZS5kcmFnQ2xvbmVcclxuXHRcdEBhdHRyIHZpc2liaWxpdHk6ICdoaWRkZW4nXHJcblx0XHRpZiBoYW5kLnRhYmxlLmFwcE1vZGUgaXMgJ2RlYWxpbmcnXHJcblx0XHRcdGZvciBuYW1lLCB0YWJsZUhhbmQgb2YgaGFuZC50YWJsZS5oYW5kcyB3aGVuIHRhYmxlSGFuZCBpc250IGhhbmRcclxuXHRcdFx0XHRcdHRhYmxlSGFuZC5mYW5GcmFtZS5hdHRyIHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xyXG5cdGlmIGhhbmQudGFibGUuYXBwTW9kZSBpcyAnZGVhbGluZydcclxuXHRcdGhhbmQudGFibGUuZHJhZ0Nsb25lPy50cmFuc2Zvcm0gXCJ0XFxcclxuXHRcdCN7eCAtIGhhbmQudGFibGUucGFjay5jYXJkV2lkdGggLyAyIH1cclxuXHRcdCwje3kgLSBoYW5kLnRhYmxlLnBhY2suY2FyZEhlaWdodCAvIDIgfVxcXHJcblx0XHRzI3toYW5kLnRhYmxlLmNhcmRTaXplUmF0aW99XCJcclxuXHJcbkhhbmQ6OmRyYWdTdGFydENhcmQgPSAtPlxyXG5cdGhhbmQgPSBAZGF0YSAnaGFuZCdcclxuXHRoYW5kLnRhYmxlLm1vdXNlRG93bkNhcmQgPSBAXHJcblx0aGFuZC50YWJsZS5jYXJkUm93Py51blNldEhvdmVycygpXHJcblx0Zm9yIG5hbWUsIHRhYmxlSGFuZCBvZiBoYW5kLnRhYmxlLmhhbmRzXHJcblx0XHR0YWJsZUhhbmQudW5TZXRIb3ZlcnMoKVxyXG5cclxuSGFuZDo6ZHJhZ0VuZENhcmQgPSAoZSkgLT5cclxuXHRjYXJkID0gQFxyXG5cdGhhbmQgPSBAZGF0YSAnaGFuZCdcclxuXHR1bmxlc3MgaGFuZC50YWJsZS5kcmFnQ2xvbmUgIyBoYW5kbGluZyBcImNsaWNrXCJcclxuXHRcdGlmIEAgaXMgaGFuZC50YWJsZS5tb3VzZURvd25DYXJkXHJcblx0XHRcdHBpY2tlZCA9IGhhbmQuY2FyZHMuc3BsaWNlIChAZGF0YSAnaGFuZEluZGV4JyksIDFcclxuXHRcdFx0YW5pbUNsb25lID0gQGNsb25lKClcclxuXHRcdFx0QHJlbW92ZSgpXHJcblx0XHRcdGhhbmQudGFibGUuc25hcEFyZWEuYWRkIGFuaW1DbG9uZVxyXG5cdFx0XHRpZiBoYW5kLnRhYmxlLmFwcE1vZGUgaXMgJ21vdmluZycgIyBtb3ZpbmcgY2FyZHNcclxuXHRcdFx0XHRsYXN0VHJpY2sgPSBoYW5kLnRhYmxlLmRlYWwudHJpY2tzWyhoYW5kLnRhYmxlLmRlYWwudHJpY2tzLmxlbmd0aCAtIDEpXVxyXG5cdFx0XHRcdGN1cnJlbnRUcmFuc2Zvcm0gPSBAZGF0YSAnY3VycmVudFRyYW5zZm9ybSdcclxuXHRcdFx0XHRhbmltQ2xvbmUudHJhbnNmb3JtIFwidCN7ZS5wYWdlWCAtIGhhbmQucGFjay5jYXJkV2lkdGggLyAyfSxcIiArXHJcblx0XHRcdFx0XCIje2UucGFnZVkgLSBoYW5kLnBhY2suY2FyZEhlaWdodCAvIDJ9LFwiICtcclxuXHRcdFx0XHRcInMje2hhbmQudGFibGUuY2FyZFNpemVSYXRpb31cIlxyXG5cdFx0XHRcdHRyaWNrWCA9IGhhbmQudGFibGUuY29vcmRzLmNlbnRlci54IC1cclxuXHRcdFx0XHRcdGxhc3RUcmljay5zaGlmdHNSb3RhdGlvbnNbXCIje2hhbmQuc2VhdH1cIl0uc2hpZnQueFxyXG5cdFx0XHRcdHRyaWNrWSA9IGhhbmQudGFibGUuY29vcmRzLm5vcnRoLnkgLVxyXG5cdFx0XHRcdFx0bGFzdFRyaWNrLnNoaWZ0c1JvdGF0aW9uc1tcIiN7aGFuZC5zZWF0fVwiXS5zaGlmdC55XHJcblx0XHRcdFx0YW5pbVRvQ2VudGVyID0gXCJ0I3t0cmlja1h9LCN7dHJpY2tZfVwiICtcclxuXHRcdFx0XHRcInMje2hhbmQudGFibGUuY2FyZFNpemVSYXRpb31cIiArXHJcblx0XHRcdFx0XCJyI3tsYXN0VHJpY2suc2hpZnRzUm90YXRpb25zW1wiI3toYW5kLnNlYXR9XCJdLnJvdGF0aW9ufVwiXHJcblx0XHRcdFx0YW5pbUNsb25lLnN0b3AoKS5hbmltYXRlIHRyYW5zZm9ybTogYW5pbVRvQ2VudGVyLCAzMDBcclxuXHRcdFx0XHRzZXRUaW1lb3V0ICgtPlxyXG5cdFx0XHRcdFx0XHRhbmltQ2xvbmUucmVtb3ZlKClcclxuXHRcdFx0XHRcdFx0bGFzdFRyaWNrLmNhcmRzLnB1c2ggcGlja2VkWzBdXHJcblx0XHRcdFx0XHRcdGxhc3RUcmljay5yZW5kZXJUcmljaygpXHJcblx0XHRcdFx0XHRcdGhhbmQuYmluZE1vdmVzVG9UcmljayBsYXN0VHJpY2suY2FyZHNbMF0uc3VpdCAjPz8/Pz8/PyDQvdC1INC+0YHRgtCw0L3QvdGPLCDQt9Cw0LLQttC00Lgg0L/QtdGA0YjQsFxyXG5cdFx0XHRcdFx0XHRoYW5kLnJlbmRlckhhbmQoKVxyXG5cdFx0XHRcdFx0KSwgMzEwXHJcblx0XHRcdGVsc2UgIyBkZWFsaW5nIGNhcmRzXHJcblx0XHRcdFx0YW5pbVRvUm93ID0gXCJ0I3toYW5kLnRhYmxlLmNvb3Jkcy5ub3J0aC54fSxcclxuXHRcdFx0XHRcdCN7aGFuZC50YWJsZS5jb29yZHMubG93ZXJSb3cueX1cclxuXHRcdFx0XHRcdHMje2hhbmQudGFibGUuY2FyZFNpemVSYXRpb31cIiAjINCwINC00L4g0YbRjNC+0LPQviDQsdGD0LvQviDQvNCw0YHRiNGC0LDQsdGD0LLQsNC90L3RjyDQvdCw0LLQutC+0LvQviAwLDBcclxuXHRcdFx0XHRhbmltQ2xvbmUuc3RvcCgpLmFuaW1hdGUgdHJhbnNmb3JtOiBhbmltVG9Sb3csIDE4MCwgbWluYS5iYWNrb3V0XHJcblx0XHRcdFx0c2V0VGltZW91dCAoLT5cclxuXHRcdFx0XHRcdGFuaW1DbG9uZS5yZW1vdmUoKVxyXG5cdFx0XHRcdFx0aGFuZC50YWJsZS5jYXJkUm93LmNhcmRzLnB1c2ggcGlja2VkWzBdXHJcblx0XHRcdFx0XHRoYW5kLnRhYmxlLmNhcmRSb3cucmVuZGVyQ2FyZFJvdygpXHJcblx0XHRcdFx0XHRoYW5kLnJlbmRlckhhbmQoKVxyXG5cdFx0XHRcdFx0Zm9yIG5hbWUsIHRhYmxlSGFuZCBvZiBoYW5kLnRhYmxlLmhhbmRzXHJcblx0XHRcdFx0XHRcdHRhYmxlSGFuZC5zZXRIb3ZlcnMoKVxyXG5cdFx0XHRcdFx0aGFuZC5zZXREcmFncygpXHJcblx0XHRcdFx0XHQpLCAyMDBcclxuXHRlbHNlICMgaGFuZGxpbmcgZHJhZ1xyXG5cdFx0Zm9yIG5hbWUsIHRhYmxlSGFuZCBvZiBoYW5kLnRhYmxlLmhhbmRzIHdoZW4gdGFibGVIYW5kIGlzbnQgaGFuZFxyXG5cdFx0XHRpZiBTbmFwLnBhdGguaXNQb2ludEluc2lkZSB0YWJsZUhhbmQuZmFuRnJhbWVQYXRoLCBlLnBhZ2VYLCBlLnBhZ2VZXHJcblx0XHRcdFx0c2VsZWN0ZWRIYW5kID0gdGFibGVIYW5kXHJcblx0XHRcdFx0YnJlYWtcclxuXHRcdGlmIHNlbGVjdGVkSGFuZCAjIHRhcmdldCBleGlzdHNcclxuXHRcdFx0cGlja2VkID0gaGFuZC5jYXJkcy5zcGxpY2UgKEBkYXRhICdoYW5kSW5kZXgnKSwgMVxyXG5cdFx0XHRwaWNrZWRbMF0uaGFuZCA9IHNlbGVjdGVkSGFuZC5zZWF0XHJcblx0XHRcdHNlbGVjdGVkSGFuZC5jYXJkcy5wdXNoIHBpY2tlZFswXVxyXG5cdFx0XHRoYW5kLnRhYmxlLmRyYWdDbG9uZS5yZW1vdmUoKVxyXG5cdFx0XHRoYW5kLnRhYmxlLmRyYWdDbG9uZSA9IG51bGxcclxuXHRcdFx0aGFuZC50YWJsZS5jYXJkUm93Py5zZXRIb3ZlcnMoKVxyXG5cdFx0XHRoYW5kLnJlbmRlckhhbmQoKVxyXG5cdFx0XHRzZWxlY3RlZEhhbmQucmVuZGVySGFuZCgpXHJcblx0XHRcdGZvciBuYW1lLCB0YWJsZUhhbmQgb2YgaGFuZC50YWJsZS5oYW5kc1xyXG5cdFx0XHRcdHRhYmxlSGFuZC5mYW5GcmFtZS5hdHRyIHZpc2liaWxpdHk6ICdoaWRkZW4nXHJcblx0XHRcdFx0dGFibGVIYW5kLnNldEhvdmVycygpXHJcblx0XHRcdFx0dGFibGVIYW5kLnNldERyYWdzKClcclxuXHRcdGVsc2UgIyBubyB0YXJnZXRcclxuXHRcdFx0aWYgaGFuZC50YWJsZS5kcmFnQ2xvbmVcclxuXHRcdFx0XHRoYW5kLnRhYmxlLmRyYWdDbG9uZS5zdG9wKClcclxuXHRcdFx0XHQuYW5pbWF0ZSB0cmFuc2Zvcm06IFwiI3tAZGF0YSAnY3VycmVudFRyYW5zZm9ybSd9dDAsMFwiXHJcblx0XHRcdFx0LCA0MDAsIG1pbmEuYmFja291dFxyXG5cdFx0XHRcdHNldFRpbWVvdXQgKC0+XHJcblx0XHRcdFx0XHRoYW5kLnRhYmxlLmRyYWdDbG9uZS5yZW1vdmUoKVxyXG5cdFx0XHRcdFx0aGFuZC50YWJsZS5kcmFnQ2xvbmUgPSBudWxsXHJcblx0XHRcdFx0XHRjYXJkLnRyYW5zZm9ybSBcIiN7Y2FyZC5kYXRhICdjdXJyZW50VHJhbnNmb3JtJ310MCwwXCJcclxuXHRcdFx0XHRcdGNhcmQuYXR0ciB2aXNpYmlsaXR5OiAndmlzaWJsZSdcclxuXHRcdFx0XHRcdGhhbmQudGFibGUubW91c2VEb3duQ2FyZCA9IG51bGxcclxuXHRcdFx0XHRcdGZvciBuYW1lLCB0YWJsZUhhbmQgb2YgaGFuZC50YWJsZS5oYW5kc1xyXG5cdFx0XHRcdFx0XHR0YWJsZUhhbmQuZmFuRnJhbWUuYXR0ciB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xyXG5cdFx0XHRcdFx0XHR0YWJsZUhhbmQuc2V0SG92ZXJzKClcclxuXHRcdFx0XHRcdCksIDQwMVxyXG5cclxuSGFuZDo6YmluZE1vdmVzVG9UcmljayA9IChjdXJyZW50U3VpdCkgLT5cclxuXHRzZWxmID0gQFxyXG5cdGxhc3RUcmljayA9IEB0YWJsZS5kZWFsLnRyaWNrc1soQHRhYmxlLmRlYWwudHJpY2tzLmxlbmd0aCAtIDEpXVxyXG5cdHN3aXRjaCBsYXN0VHJpY2suY2FyZHMubGVuZ3RoXHJcblx0XHQjIHRoZXJlJ3Mgbm8gbmVlZCB0byB1bnNldCBob3ZlcnMgZm9yIHRoZSBoYW5kc1xyXG5cdFx0IyB0aGF0IG1vdmVzIGhhdmUgYmVlbiBtYWRlIGZyb20sIGUuZy4gZm9yIGZpcnN0XHJcblx0XHQjIGhhbmQgYWZ0ZXIgaXRzIG1vdmUgc2luY2UgSGFuZC51blNldEhvdmVycyB3YXNcclxuXHRcdCMgbWFkZSBmb3IgZXZlcnkgaGFuZCBvbiB0aGUgdGFibGUgaW4gSGFuZC5kcmFnU3RhcnRDYXJkO1xyXG5cdFx0IyBhbm90aGVyIHRyaWNrIGlzIG5vdCB0byBmb3JnZXQgdG8gc2V0SG92ZXJzIGZvciB0aGVcclxuXHRcdCMgdGhpcmQgaGFuZCB0d2ljZSAodGhlIHNlY29uZCB0aW1lIGFmdGVyIHRoZSBzZWNvbmQnc1xyXG5cdFx0IyBoYW5kIG1vdmUpIGZvciB0aGUgc2FtZSByZWFzb25cclxuXHRcdHdoZW4gMFxyXG5cdFx0XHRAdGFibGUuaGFuZHNbXCIje2xhc3RUcmljay5oYW5kc1swXX1cIl0uc2V0SG92ZXJzKClcclxuXHRcdFx0QHRhYmxlLmhhbmRzW1wiI3tsYXN0VHJpY2suaGFuZHNbMF19XCJdLnNldERyYWdzKClcclxuXHRcdHdoZW4gMVxyXG5cdFx0XHRAdGFibGUuaGFuZHNbXCIje2xhc3RUcmljay5oYW5kc1sxXX1cIl0uc2V0SG92ZXJzKGN1cnJlbnRTdWl0KVxyXG5cdFx0XHRAdGFibGUuaGFuZHNbXCIje2xhc3RUcmljay5oYW5kc1sxXX1cIl0uc2V0RHJhZ3MoKVxyXG5cdFx0XHRAdGFibGUuaGFuZHNbXCIje2xhc3RUcmljay5oYW5kc1syXX1cIl0uc2V0SG92ZXJzKGN1cnJlbnRTdWl0KVxyXG5cdFx0d2hlbiAyXHJcblx0XHRcdEB0YWJsZS5oYW5kc1tcIiN7bGFzdFRyaWNrLmhhbmRzWzFdfVwiXS51blNldERyYWdzKClcclxuXHRcdFx0QHRhYmxlLmhhbmRzW1wiI3tsYXN0VHJpY2suaGFuZHNbMl19XCJdLnNldEhvdmVycygpXHJcblx0XHRcdEB0YWJsZS5oYW5kc1tcIiN7bGFzdFRyaWNrLmhhbmRzWzJdfVwiXS5zZXREcmFncygpXHJcblx0XHR3aGVuIDNcclxuXHRcdFx0QHRhYmxlLmhhbmRzW1wiI3tsYXN0VHJpY2suaGFuZHNbMl19XCJdLnVuU2V0RHJhZ3MoKVxyXG5cdFx0XHR3aW5uZXIgPSBsYXN0VHJpY2suZ2V0V2lubmVyQ2FyZCgpLmhhbmRcclxuXHRcdFx0d2lubmVySGFuZCA9IEB0YWJsZS5oYW5kc1tcIiN7d2lubmVyfVwiXVxyXG5cdFx0XHR3aW5uZXJIYW5kLmFsbG93ZWRTdWl0ID0gbnVsbFxyXG5cdFx0XHRjbG9uZUxhc3RUcmljayA9IE9iamVjdC5jcmVhdGUgbGFzdFRyaWNrXHJcblx0XHRcdHdpbm5lckhhbmQudHJpY2tzLnB1c2ggY2xvbmVMYXN0VHJpY2tcclxuXHRcdFx0c2VsZi50YWJsZS5kZWFsLmZpcnN0SGFuZCA9IHdpbm5lckhhbmQuc2VhdFxyXG5cdFx0XHRzZWxmLnRhYmxlLmRlYWwudHJpY2tzLnB1c2ggbmV3IFRyaWNrIEB0YWJsZSwgQHBhY2tcclxuXHRcdFx0bGFzdFRyaWNrLmFuaW1hdGVUcmlja1RvSGFuZCAxMDAwLCB3aW5uZXJIYW5kXHJcblx0XHRcdHNldFRpbWVvdXQgKC0+XHJcblx0XHRcdFx0d2lubmVySGFuZC5yZW5kZXJUcmlja3MoKVxyXG5cdFx0XHRcdHdpbm5lckhhbmQucmVuZGVySGFuZCgpXHJcblx0XHRcdFx0d2lubmVySGFuZC5iaW5kTW92ZXNUb1RyaWNrKClcclxuXHRcdFx0XHQpLCAxMjAwXHJcblxyXG5IYW5kOjpyZW5kZXJIYW5kID0gLT5cclxuXHQjIHNldHRpbmcgJ3N0YXJ0JyBidXR0b24gYWN0aXZlL2luYWN0aXZlXHJcblx0aWYgQHRhYmxlLmFwcE1vZGUgaXMgJ2RlYWxpbmcnXHJcblx0XHRpZiBAY2FyZHMubGVuZ3RoXHJcblx0XHRcdCMgY29tcGFyZSBoYW5kcycgY2FyZHMnIG51bWJlclxyXG5cdFx0XHRudW1iZXJzID0gW11cclxuXHRcdFx0Zm9yIG4sIGggb2YgQHRhYmxlLmhhbmRzXHJcblx0XHRcdFx0bnVtYmVycy5wdXNoIGguY2FyZHMubGVuZ3RoXHJcblx0XHRcdGFyZVRoZVNhbWUgPSB5ZXNcclxuXHRcdFx0Zm9yIGVsLCBpIGluIG51bWJlcnNcclxuXHRcdFx0XHRpZiBudW1iZXJzW2kgKyAxXSA+PSAwICMgaWYgbmV4dCBlbCBleGlzdHNcclxuXHRcdFx0XHQjIGNhbm5vdCB1c2UgaWYgbnVtYmVyc1tpICsgMV0gYXMgY2FyZHMgbnVtIGNhbiBiZSAwXHJcblx0XHRcdFx0IyB3aGljaCBnaXZlcyAnZmFsc2UnXHJcblx0XHRcdFx0XHRpZiBlbCBpc250IG51bWJlcnNbaSArIDFdXHJcblx0XHRcdFx0XHRcdGFyZVRoZVNhbWUgPSBub1xyXG5cdFx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHQjIGlmIG51bWJlcnMubGVuZ3RoIGlzIDMgYW5kIGFyZVRoZVNhbWUgIyB0aGVyZSBhbHdheXMgdGhyZWUgcGxheWluZyBoYW5kc1xyXG5cdFx0XHRpZiBhcmVUaGVTYW1lXHJcblx0XHRcdFx0QHRvb2xCYXIuYnV0dG9ucy5zdGFydFswXS5hdHRyIGZpbGw6ICd3aGl0ZSdcclxuXHRcdFx0XHRAdG9vbEJhci5idXR0b25zLnN0YXJ0LmRhdGEgJ2lzQWN0aXZlJywgeWVzXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBAdG9vbEJhci5idXR0b25zLnN0YXJ0LmRhdGEgJ2lzQWN0aXZlJ1xyXG5cdFx0XHRcdFx0QHRvb2xCYXIuYnV0dG9ucy5zdGFydFswXS5hdHRyIGZpbGw6ICcjNDQ0J1xyXG5cdFx0XHRcdFx0QHRvb2xCYXIuYnV0dG9ucy5zdGFydC5kYXRhICdpc0FjdGl2ZScsIG5vXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIEB0b29sQmFyLmJ1dHRvbnMuc3RhcnQuZGF0YSAnaXNBY3RpdmUnXHJcblx0XHRcdFx0QHRvb2xCYXIuYnV0dG9ucy5zdGFydFswXS5hdHRyIGZpbGw6ICcjNDQ0J1xyXG5cdFx0XHRcdEB0b29sQmFyLmJ1dHRvbnMuc3RhcnQuZGF0YSAnaXNBY3RpdmUnLCBub1xyXG5cclxuXHRpZiBAY2FyZHMubGVuZ3RoXHJcblx0XHRmb3IgZWwgaW4gQGhhbmRHcm91cFxyXG5cdFx0XHRlbC5yZW1vdmUoKVxyXG5cdFx0QGhhbmRHcm91cCA9IFtdXHJcblx0XHRzZWxmID0gQFxyXG5cdFx0QGNhcmRSb3RhdGlvbnMgPSBbXVxyXG5cdFx0QGdldFNvcnRPcmRlcnMoKVxyXG5cdFx0QGNhcmRzLnNvcnQgQHBhY2suY2FyZFNvcnRlciBAc29ydGVkVW5pcXVlU3VpdHMsIEByYW5EaXJlY3Rpb25WYWx1ZXNcclxuXHJcblx0XHRmb3IgY2FyZCwgaSBpbiBAY2FyZHNcclxuXHRcdFx0Y2FyZEdyb3VwID0gQHRhYmxlLnNuYXBBcmVhLmcoKVxyXG5cdFx0XHRjYXJkR3JvdXBcclxuXHRcdFx0XHQuZGF0YSAncGFja0luZGV4JywgY2FyZC5wYWNrSW5kZXhcclxuXHRcdFx0XHQuZGF0YSAnaGFuZEluZGV4JywgaVxyXG5cdFx0XHRcdC5kYXRhICdzdWl0JywgY2FyZC5zdWl0XHJcblx0XHRcdFx0LmRhdGEgJ3ZhbHVlJywgY2FyZC52YWx1ZVxyXG5cdFx0XHRcdC5kYXRhICdoYW5kJywgc2VsZlxyXG5cdFx0XHRcdC5hZGQgc2VsZi5wYWNrLmNhcmRzW2NhcmQucGFja0luZGV4XS5waWMuc2VsZWN0KCdzdmcnKS5jbG9uZSgpXHJcblx0XHRcdEBoYW5kR3JvdXAucHVzaCBjYXJkR3JvdXBcclxuXHJcblx0XHRAaGFuZENhcmRzQ291bnRlclxyXG5cdFx0XHQudHJhbnNmb3JtIFwidCN7QHRhYmxlLmNvb3Jkc1tAc2VhdF0uc2VjdG9yRmFuWH1cclxuXHRcdFx0LCN7QHRhYmxlLmNvb3Jkc1tAc2VhdF0uc2VjdG9yRmFuWSAtIEB0YWJsZS5jYXJkSGVpZ2h0IC8gNCB9XCJcclxuXHRcdFx0LmF0dHIgdGV4dDogQGNhcmRzLmxlbmd0aCwgJ2ZvbnQtc2l6ZSc6IEB0YWJsZS5jYXJkSGVpZ2h0IC8gNFxyXG5cdFx0XHQsIHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xyXG5cclxuXHRcdGZvciBlbCwgaSBpbiBAaGFuZEdyb3VwXHJcblx0XHRcdHJvdGF0aW9uQW5nbGUgPSBzZWxmLnNoaWZ0QW5nbGUgKiAoaSAtIEBjYXJkcy5sZW5ndGggLyAyIC0gLjUpIyAtIHNlbGYuc2hpZnRBbmdsZSAvIDJcclxuXHRcdFx0Y2FyZFJvdGF0aW9uID0gXCJyI3tyb3RhdGlvbkFuZ2xlfVwiXHJcblx0XHRcdEBjYXJkUm90YXRpb25zLnB1c2ggcm90YXRpb25BbmdsZVxyXG5cdFx0XHRlbC50cmFuc2Zvcm0gXCJ0MCwwczEsMCwwcjAsMCwwXCJcclxuXHRcdFx0ZWwuZGF0YSAnY3VycmVudFRyYW5zZm9ybScsIFwidCN7QHRhYmxlLmNvb3Jkc1tAc2VhdF0ueH1cIiArXHJcblx0XHRcdFwiLCN7QHRhYmxlLmNvb3Jkc1tAc2VhdF0ueX1zI3tAdGFibGUuY2FyZFNpemVSYXRpb30sMCwwXCJcclxuXHRcdFx0ZWwudHJhbnNmb3JtIFwiI3tlbC5kYXRhICdjdXJyZW50VHJhbnNmb3JtJ31cIlxyXG5cdFx0XHRjYXJkUm90YXRpb25DZW50ZXIgPSBcIiwje0B0YWJsZS5jb29yZHMucm90WH0sI3tAdGFibGUuY29vcmRzLnJvdFl9XCJcclxuXHRcdFx0bmV4dFRyYW5zZm9ybSA9IFwiI3tlbC5kYXRhICdjdXJyZW50VHJhbnNmb3JtJ30je2NhcmRSb3RhdGlvbn1cIiArXHJcblx0XHRcdFwiI3tjYXJkUm90YXRpb25DZW50ZXJ9XCJcclxuXHRcdFx0ZWwuc3RvcCgpLmFuaW1hdGUgdHJhbnNmb3JtOiBuZXh0VHJhbnNmb3JtLCA1MDAsIG1pbmEuYmFja291dFxyXG5cdFx0XHRlbC5kYXRhICdjdXJyZW50VHJhbnNmb3JtJywgbmV4dFRyYW5zZm9ybVxyXG5cdGVsc2VcclxuXHRcdEBoYW5kQ2FyZHNDb3VudGVyLmF0dHIgdmlzaWJpbGl0eTogJ2hpZGRlbidcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGFuZCIsImNsYXNzIFBhY2tcclxuXHRjb25zdHJ1Y3RvcjogKGNiKSAtPlxyXG5cdFx0QGNhcmROYW1lcyA9XHRbICc3YycsICc4YycsICc5YycsICcxMGMnLCAnamMnLCAncWMnLCAna2MnLCAnYWMnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCc3ZCcsICc4ZCcsICc5ZCcsICcxMGQnLCAnamQnLCAncWQnLCAna2QnLCAnYWQnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCc3aCcsICc4aCcsICc5aCcsICcxMGgnLCAnamgnLCAncWgnLCAna2gnLCAnYWgnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCc3cycsICc4cycsICc5cycsICcxMHMnLCAnanMnLCAncXMnLCAna3MnLCAnYXMnIF1cclxuXHRcdEBjYXJkcyA9IFtdXHJcblx0XHRAc29ydFZhbHVlcyA9IFsnNycsICc4JywgJzknLCAnMTAnLCAnaicsICdxJywgJ2snLCAnYSddXHJcblx0XHRAZ2V0UGFjayAtPlxyXG5cdFx0XHRjYigpXHJcblxyXG5QYWNrOjpnZXRQYWNrID0gKGNiKSAtPlxyXG5cdHBhY2sgPSBbXVxyXG5cdGZvciBjLCBpIGluIEBjYXJkTmFtZXNcclxuXHRcdGF3YWl0IFNuYXAubG9hZCBcImNhcmRzLyN7Y30uc3ZnXCIsIGRlZmVyIGNhcmRQaWNcclxuXHRcdHBhY2sucHVzaCBzdWl0OiBjLnNsaWNlKC0xKSwgdmFsdWU6IGMuc2xpY2UoLTMsIC0xKSwgcGljOiBjYXJkUGljXHJcblx0QGNhcmRzID0gcGFja1xyXG5cdGF3YWl0XHJcblx0XHRTbmFwLmxvYWQgXCJjYXJkcy9iYWNrX2JsdWUuc3ZnXCIsIGRlZmVyIGJhY2tfYmx1ZVxyXG5cdFx0U25hcC5sb2FkIFwiY2FyZHMvYmFja19yZWQuc3ZnXCIsIGRlZmVyIGJhY2tfcmVkXHJcblx0XHRTbmFwLmxvYWQgXCJjYXJkcy9jbHVicy5zdmdcIiwgZGVmZXIgY2x1YnNfY2FyZFxyXG5cdFx0U25hcC5sb2FkIFwiY2FyZHMvZGlhbW9uZHMuc3ZnXCIsIGRlZmVyIGRpYW1vbmRzX2NhcmRcclxuXHRcdFNuYXAubG9hZCBcImNhcmRzL2hlYXJ0cy5zdmdcIiwgZGVmZXIgaGVhcnRzX2NhcmRcclxuXHRcdFNuYXAubG9hZCBcImNhcmRzL3NwYWRlcy5zdmdcIiwgZGVmZXIgc3BhZGVzX2NhcmRcclxuXHRAYmFja0JsdWUgPSBiYWNrX2JsdWUuc2VsZWN0KCdzdmcnKVxyXG5cdEBiYWNrUmVkID0gYmFja19yZWQuc2VsZWN0KCdzdmcnKVxyXG5cdEBjbHVicyA9IGNsdWJzX2NhcmQuc2VsZWN0KCdzdmcnKVxyXG5cdEBkaWFtb25kcyA9IGRpYW1vbmRzX2NhcmQuc2VsZWN0KCdzdmcnKVxyXG5cdEBoZWFydHMgPSBoZWFydHNfY2FyZC5zZWxlY3QoJ3N2ZycpXHJcblx0QHNwYWRlcyA9IHNwYWRlc19jYXJkLnNlbGVjdCgnc3ZnJylcclxuXHQjIGdldEJCb3ggPz8/PyBhbmQgLi4ucGljOiBjYXJkUGljLnNlbGVjdCgnc3ZnJykgPz8/XHJcblx0QGNhcmRXaWR0aCA9IEBjYXJkc1swXS5waWMubm9kZS5jaGlsZHJlblswXS5hdHRyaWJ1dGVzLndpZHRoLnZhbHVlXHJcblx0QGNhcmRIZWlnaHQgPSBAY2FyZHNbMF0ucGljLm5vZGUuY2hpbGRyZW5bMF0uYXR0cmlidXRlcy5oZWlnaHQudmFsdWVcclxuXHRjYigpXHJcblxyXG5QYWNrOjpzaHVmZmxlID0gLT5cclxuXHRtID0gQGNhcmRzLmxlbmd0aFxyXG5cdHdoaWxlIG1cclxuXHRcdGkgPSBNYXRoLmZsb29yIChNYXRoLnJhbmRvbSgpICogbS0tKVxyXG5cdFx0dCA9IEBjYXJkc1ttXVxyXG5cdFx0QGNhcmRzW21dID0gQGNhcmRzW2ldXHJcblx0XHRAY2FyZHNbaV0gPSB0XHJcblxyXG5QYWNrOjpjYXJkU29ydGVyID0gKHNvcnRTdWl0cywgc29ydFZhbHVlcyA9IEBzb3J0VmFsdWVzKSAtPlxyXG5cdChjdXJyZW50LCBuZXh0KSAtPlxyXG5cdFx0aWYgc29ydFN1aXRzLmluZGV4T2YoY3VycmVudC5zdWl0KSA8IHNvcnRTdWl0cy5pbmRleE9mKG5leHQuc3VpdClcclxuXHRcdFx0cmV0dXJuIC0xXHJcblx0XHRpZiBzb3J0U3VpdHMuaW5kZXhPZihjdXJyZW50LnN1aXQpID4gc29ydFN1aXRzLmluZGV4T2YobmV4dC5zdWl0KVxyXG5cdFx0XHRyZXR1cm4gMVxyXG5cdFx0aWYgc29ydFZhbHVlcy5pbmRleE9mKGN1cnJlbnQudmFsdWUpIDwgc29ydFZhbHVlcy5pbmRleE9mKG5leHQudmFsdWUpXHJcblx0XHRcdHJldHVybiAxXHJcblx0XHRpZiBzb3J0VmFsdWVzLmluZGV4T2YoY3VycmVudC52YWx1ZSkgPiBzb3J0VmFsdWVzLmluZGV4T2YobmV4dC52YWx1ZSlcclxuXHRcdFx0cmV0dXJuIC0xXHJcblxyXG5cdCMg0LLQuNC90LXRgdC10L3QviDQvtC60YDQtdC80L4sINCx0L4g0YHQvtGA0YLRg9Cy0LDRgtC4INC/0L7RgtGA0ZbQsdC90L4g0L3QtSDQu9C40YjQtSDRgNGD0LrQuCxcclxuXHQjINCwINC5INC/0L7Rh9Cw0YLQutC+0LLQuNC5INGA0Y/QtCDQutCw0YDRgiwg0Lcg0Y/QutC+0LPQviDQstC+0L3QuCDRhNC+0YDQvNGD0Y7RjtGC0YzRgdGPLFxyXG5cdCMg0LHQviDQvdCw0LfQstC4INC80LDRgdGC0LXQuSBjbHVicywgZGlhbW9uZHMsIGhlYXJ0cywgc3BhZGVzXHJcblx0IyDQv9GA0LjQt9Cy0L7QtNGP0YLRjCDQtNC+INC/0L7RgdC70ZbQtNC+0LLQvdC+0YHRgtGWINGH0L7RgNC90LjQuS3Rh9C10YDQstC+0L3QuNC5LdGH0LXRgNCy0L7QvdC40Lkt0YfQvtGA0L3QuNC5XHJcblx0IyDQv9GA0Lgg0YfQuNGC0LDQvdC90ZYg0LfQvtCx0YDQsNC20LXQvdGMINC3INC00LjRgdC60YMsINGJ0L4g0LLQuNCz0LvRj9C00LDRlCDQvdC1INC00YPQttC1XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYWNrIiwiY2xhc3MgVGFibGVcclxuXHRjb25zdHJ1Y3RvcjogKHdpZHRoLCBoZWlnaHQsIEBwYWNrKSAtPlxyXG5cdFx0QG1vdXNlRG93bkNhcmQgPSBudWxsXHJcblx0XHRAZHJhZ0Nsb25lID0gbnVsbFxyXG5cdFx0QHNuYXBBcmVhID0gU25hcCgpXHJcblx0XHRAZmFuU2hpZnRGYWN0b3IgPSAxLjhcclxuXHRcdEBnZXRDb29yZHMgd2lkdGgsIGhlaWdodFxyXG5cdFx0QGNhcmRSb3cgPSB7fVxyXG5cdFx0QGhhbmRzID0ge31cclxuXHJcblRhYmxlOjpnZXRDb29yZHMgPSAod2lkdGgsIGhlaWdodCkgLT5cclxuXHQjIEB3aWR0aCA9IGlmIHdpZHRoID4gNjQwIHRoZW4gd2lkdGggZWxzZSA2NDBcclxuXHQjIEBoZWlnaHQgPSBpZiBoZWlnaHQgPiA0ODAgdGhlbiBoZWlnaHQgZWxzZSA0ODBcclxuXHQjIGNvbnNvbGUubG9nIFwiI3tAd2lkdGh9eCN7QGhlaWdodH1cIlxyXG5cdEB3aWR0aCA9IHdpZHRoXHJcblx0QGhlaWdodCA9IGhlaWdodFxyXG5cclxuXHQjIGlmIEBzbmFwQXJlYSB0aGVuIEBzbmFwQXJlYS5hdHRyIHdpZHRoOiBAd2lkdGgsIGhlaWdodDogQGhlaWdodFxyXG5cdCMgZWxzZVxyXG5cdCMgXHRAc25hcEFyZWEgPSBTbmFwIEB3aWR0aCwgQGhlaWdodFxyXG5cdCMgQHNuYXBBcmVhLmF0dHIgd2lkdGg6IEB3aWR0aCwgaGVpZ2h0OiBAaGVpZ2h0XHJcblxyXG5cdEBjYXJkV2lkdGggPSBAd2lkdGggKiAwLjExXHJcblx0IyBAY2FyZEhlaWdodCA9IEBwYWNrLmNhcmRIZWlnaHQgKiBAY2FyZFdpZHRoIC8gQHBhY2suY2FyZFdpZHRoXHJcblx0QGNhcmRTaXplUmF0aW8gPSBAY2FyZFdpZHRoIC8gQHBhY2suY2FyZFdpZHRoXHJcblx0QGNhcmRIZWlnaHQgPSBAcGFjay5jYXJkSGVpZ2h0ICogQGNhcmRTaXplUmF0aW9cclxuXHJcblx0QGNvb3JkcyA9XHJcblx0XHRcdFx0XHRcdCMg0YfQvtC80YMg0YHQsNC80LUgQHBhY2suY2FyZFdpZHRoLCDQsCDQvdC1XHJcblx0XHRcdFx0XHRcdCMgQGNhcmRXaWR0aCDQtNC70Y8g0LzQtdC90LUg0LfQsNCz0LDQtNC60LBcclxuXHRcdFx0XHRcdFx0cm90WDogQHBhY2suY2FyZFdpZHRoIC8gNFxyXG5cdFx0XHRcdFx0XHRyb3RZOiBAcGFjay5jYXJkSGVpZ2h0XHJcblx0XHRcdFx0XHRcdGNlbnRlcjpcclxuXHRcdFx0XHRcdFx0XHR4OiAoQHdpZHRoIC0gQHBhY2suY2FyZFdpZHRoKSAvIDJcclxuXHRcdFx0XHRcdFx0XHR5OiAoQGhlaWdodCAtIEBwYWNrLmNhcmRIZWlnaHQpIC8gMlxyXG5cdFx0XHRcdFx0XHQjIGZhbklubmVyUjogQGNhcmRIZWlnaHQgKiAuMlxyXG5cdFx0XHRcdFx0XHRmYW5Jbm5lclI6IEBjYXJkSGVpZ2h0ICogLjU1XHJcblx0XHRcdFx0XHRcdGZhbk91dGVyUjogQGNhcmRIZWlnaHQgKiAxLjk1XHJcblxyXG5cdFx0XHRcdFx0XHQjINGD0YHRliDQutC+0L7RgNC00LjQvdCw0YLQuCDQv9GW0LTQsdC40YDQsNC70LjRgdGPINC10LzQv9GW0YDQuNGH0L3Qviwg0YIu0Y8uXHJcblx0XHRcdFx0XHRcdCMg0L7QsdC10YDRgtCw0L3QvdGPINC60L7QttC90L7RlyDQutCw0YDRgtC4INGDIFwi0LLRltGP0LvRllwiINGA0L7QsdC40YLRjNGB0Y9cclxuXHRcdFx0XHRcdFx0IyDQvdCw0LLQutC+0LvQviBcItC90LXRgdC40LzQtdGC0YDQuNGH0L3QvtGXXCIg0YLQvtGH0LrQuFxyXG5cdFx0XHRcdFx0XHRzb3V0aDpcclxuXHRcdFx0XHRcdFx0XHR4OiAoQHdpZHRoIC0gQGNhcmRXaWR0aCkgLyAyICsgQGNhcmRXaWR0aCAvIDRcclxuXHRcdFx0XHRcdFx0XHR5OiAoQGhlaWdodCAtIEBjYXJkSGVpZ2h0ICogMS4yKSAqIC44OFxyXG5cdFx0XHRcdFx0XHRcdHNlY3RvckZhblg6IChAd2lkdGggLSBAY2FyZFdpZHRoKSAvIDIgKyBAY2FyZFdpZHRoIC8gMlxyXG5cdFx0XHRcdFx0XHRcdHNlY3RvckZhblk6IChAaGVpZ2h0IC0gQGNhcmRIZWlnaHQgKiAxLjIpICogLjg4ICsgQGNhcmRIZWlnaHQgKiBAZmFuU2hpZnRGYWN0b3JcclxuXHRcdFx0XHRcdFx0bm9ydGg6XHJcblx0XHRcdFx0XHRcdFx0eDogKEB3aWR0aCAtIEBjYXJkV2lkdGgpIC8gMiArIEBjYXJkV2lkdGggLyA0XHJcblx0XHRcdFx0XHRcdFx0eTogKEBoZWlnaHQgLSBAY2FyZEhlaWdodCAqIDEuMikgKiAuMTJcclxuXHRcdFx0XHRcdFx0XHRzZWN0b3JGYW5YOiAoQHdpZHRoIC0gQGNhcmRXaWR0aCkgLyAyICsgQGNhcmRXaWR0aCAvIDJcclxuXHRcdFx0XHRcdFx0XHRzZWN0b3JGYW5ZOiAoQGhlaWdodCAtIEBjYXJkSGVpZ2h0ICogMS4yKSAqIC4xMiArIEBjYXJkSGVpZ2h0ICogQGZhblNoaWZ0RmFjdG9yXHJcblx0XHRcdFx0XHRcdHdlc3Q6XHJcblx0XHRcdFx0XHRcdFx0eDogKEB3aWR0aCAtIEBjYXJkV2lkdGggKiAuOCkgKiAuMiArIEBjYXJkV2lkdGggLyA0XHJcblx0XHRcdFx0XHRcdFx0eTogKEBoZWlnaHQgLSBAY2FyZEhlaWdodCkgLyAyXHJcblx0XHRcdFx0XHRcdFx0c2VjdG9yRmFuWDogKEB3aWR0aCAtIEBjYXJkV2lkdGggKiAuOCkgKiAuMiArIEBjYXJkV2lkdGggLyAyXHJcblx0XHRcdFx0XHRcdFx0c2VjdG9yRmFuWTogKEBoZWlnaHQgLSBAY2FyZEhlaWdodCkgLyAyICsgQGNhcmRIZWlnaHQgKiBAZmFuU2hpZnRGYWN0b3JcclxuXHRcdFx0XHRcdFx0ZWFzdDpcclxuXHRcdFx0XHRcdFx0XHR4OiAoQHdpZHRoIC0gQGNhcmRXaWR0aCAqIC44KSAqIC44ICsgQGNhcmRXaWR0aCAvIDRcclxuXHRcdFx0XHRcdFx0XHR5OiAoQGhlaWdodCAtIEBjYXJkSGVpZ2h0KSAvIDJcclxuXHRcdFx0XHRcdFx0XHRzZWN0b3JGYW5YOiAoQHdpZHRoIC0gQGNhcmRXaWR0aCAqIC44KSAqIC44ICsgQGNhcmRXaWR0aCAvIDJcclxuXHRcdFx0XHRcdFx0XHRzZWN0b3JGYW5ZOiAoQGhlaWdodCAtIEBjYXJkSGVpZ2h0KSAvIDIgKyBAY2FyZEhlaWdodCAqIEBmYW5TaGlmdEZhY3RvclxyXG5cdFx0XHRcdFx0XHRsb3dlclJvdzpcclxuXHRcdFx0XHRcdFx0XHQjIHg6ICgoQHdpZHRoIC0gQGNhcmRXaWR0aCkgLyAocm93TGVuZ3RoICsgMSkpIC8gQGNhcmRTaXplUmF0aW9cclxuXHRcdFx0XHRcdFx0XHR5OiBAY2FyZEhlaWdodCAqIC41ICMgPz8/INGF0ZTRgNC90Y8g0Y/QutCw0YHRjCwg0L/QvtGC0ZbQvCDQv9C+0LLQtdGA0L3Rg9GB0Y8uLi5cclxuXHJcblRhYmxlOjpnZXROZXh0SGFuZCA9IChjdXJyZW50SGFuZCkgLT5cclxuXHQjINC70LjRiNC1INCy0LDRgNGW0LDQvdGCIFwi0LPRg9GB0LDRgNC40LpcIiDQvdC1INC+0LHRgNC+0LHQu9C10L3Qvjog0YLQsNC8INGC0L7QuSwg0YXRgtC+INC30LTQsNGULFxyXG5cdCMg0L3QtSDRlCBcItC90LAg0L/RgNC40LrRg9C/0ZZcIiwg0ZQg0L7QutGA0LXQvNC+IFwi0LfQtNCw0Y7Rh9C40LlcIiwgXCLQv9GA0LjQutGD0L9cIiDRliBcItCx0L7Qu9Cy0LDQvVwiXHJcblx0IyDRj9C6INC90LUg0LrRgNGD0YLQuCAtINCy0YHQtSDQvtC00L3QviBcItC80LDQu9GO0LLQsNGC0LhcIiDQtNC+0LLQvtC00LjRgtGM0YHRjyDRg9GB0ZYgNCDRgNGD0LrQuFxyXG5cdCMg0YMg0LHRg9C00Ywt0Y/QutC+0LzRgyDQstCw0YDRltCw0L3RgtGWOiAyLCAzINCw0LHQviA0INCz0YDQsNCy0YbRjzsg0LzQvtC20L3QsCDQtNC+0LzQvi1cclxuXHQjINCy0LjRgtC40YHRjDog0L/RgNC4INCz0YDRliDQstGC0YDRjNC+0YUg0L/RgNC40LrRg9C/INC/0L7RgdGC0ZbQudC90L4g0L3QsCBcItC/0ZbQstC00L3RllwiINGWXHJcblx0IyDQs9GA0LDRjtGC0Ywg0LvQuNGI0LUgMyDRgNGD0LrQuCBcItC30LDRhdGW0LQt0L/RltCy0L3RltGHLdGB0YXRltC0XCIsINC/0YDQuCDQs9GA0ZYg0YPQtNCy0L7RhSAtXHJcblx0IyDQs9GA0LDRjtGC0YwgXCLQv9GW0LLQvdGW0Yct0L/RltCy0LTQtdC90YxcIiwg0L/RgNC40LrRg9C/LdCx0L7Qu9Cy0LDQvSDRh9C10YDQs9GD0Y7RgtGM0YHRjyDQvdCwXHJcblx0IyBcItGB0YXRltC0LdC30LDRhdGW0LRcIlxyXG5cclxuXHQjINC/0L7QutC4INGJ0L4g0L3QtdC80LDRlCDQv9C+0YLRgNC10LHQuCDRgNC10LDQu9GW0LfQvtCy0YPQstCw0YLQuCDQtNC70Y8g0YDRltC30L3QvtGXINC60ZbQu9GM0LrQvtGB0YLRllxyXG5cdCMg0LPRgNCw0LLRhtGW0LJcclxuXHQjIChjdXJyZW50SGFuZCwgcGxheWVyc051bWJlciwgZGVhbGVyXHJcblx0IyBpZiBwbGF5ZXJzTnVtYmVyIGlzIDRcclxuXHQjIFx0aGFuZHMgPSBbJ25vcnRoJywgJ2Vhc3QnLCAnc291dGgnLCAnd2VzdCddXHJcblx0IyBlbHNlXHJcblx0IyBcdGhhbmRzID0gWydlYXN0JywgJ25vcnRoJywgJ3dlc3QnXVxyXG5cdCMgaWYgKGhhbmRzLmluZGV4T2YgY3VycmVudEhhbmQpIDwgKGhhbmRzLmxlbmd0aCAtIDEpXHJcblx0IyBcdG5leHRIYW5kID0gaGFuZHNbKGhhbmRzLmluZGV4T2YgY3VycmVudEhhbmQpICsgMV1cclxuXHQjIGVsc2VcclxuXHQjIFx0bmV4dEhhbmQgPSBoYW5kc1swXVxyXG5cdCMgaWYgcGxheWVyc051bWJlciBpcyA0IGFuZCBuZXh0SGFuZCBpcyBkZWFsZXJcclxuXHQjIFx0ZnVydGhlckhhbmQgPSBAZ2V0TmV4dEhhbmQgbmV4dEhhbmQsIHBsYXllcnNOdW1iZXJcclxuXHQjIFx0cmV0dXJuIGZ1cnRoZXJIYW5kXHJcblx0IyBuZXh0SGFuZFxyXG5cclxuXHQjINC00LvRjyDQsNC90LDQu9GW0LfQsNGC0L7RgNCwINGA0L7Qt9C60LvQsNC00ZbQsiDRliDRgdC40LzRg9C70Y/RgtC+0YDQsCDRgNC+0LfQtNCw0Ycg0LHRg9C00LUg0LfQsNCy0LbQtNC4IDNcclxuXHRoYW5kcyA9IFsnd2VzdCcsICdlYXN0JywgJ3NvdXRoJ11cclxuXHRpZiAoaGFuZHMuaW5kZXhPZiBjdXJyZW50SGFuZCkgPCAoaGFuZHMubGVuZ3RoIC0gMSlcclxuXHRcdG5leHRIYW5kID0gaGFuZHNbKGhhbmRzLmluZGV4T2YgY3VycmVudEhhbmQpICsgMV1cclxuXHRlbHNlXHJcblx0XHRuZXh0SGFuZCA9IGhhbmRzWzBdXHJcblx0bmV4dEhhbmRcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFibGVcclxuIiwiY2xhc3MgVG9vbEJhclxyXG5cdGNvbnN0cnVjdG9yOiAoQHRhYmxlLCBjYikgLT5cclxuXHRcdEBoZWlnaHQgPSA0OFxyXG5cdFx0QG1hcmdpbiA9IDRcclxuXHRcdEBidXR0b25zID0ge30gIyBtYXliZSBhcnJheT9cclxuXHRcdEBzaGFkb3cgPSBAdGFibGUuc25hcEFyZWEuZmlsdGVyIFxcXHJcblx0XHRcdFNuYXAuZmlsdGVyLnNoYWRvdyA3LDcsMywnYmxhY2snLCAuOFxyXG5cdFx0QGdldEJ1dHRvbnMgLT5cclxuXHRcdFx0Y2IoKVxyXG5cclxuVG9vbEJhcjo6Z2V0QnV0dG9ucyA9IChjYikgLT5cclxuXHRlbmFibGVkQnV0dG9uQXR0cnMgPSBmaWxsOiAnd2hpdGUnLCBzdHJva2U6ICdibGFjaydcclxuXHQsIHN0cm9rZVdpZHRoOiAxLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xyXG5cdGRpc2FibGVkQnV0dG9uQXR0cnMgPSBmaWxsOiAnIzQ0NCcsIHN0cm9rZTogJ2JsYWNrJ1xyXG5cdCwgc3Ryb2tlV2lkdGg6IDEsIHZpc2liaWxpdHk6ICdoaWRkZW4nXHJcblxyXG5cdGF3YWl0ICMgd2FpdGluZyBmb3IgbG9hZGluZyBhbGwgaW1hZ2VzXHJcblx0XHRTbmFwLmxvYWQgXCJpY29ucy9kb2N1bWVudC5zdmdcIiwgZGVmZXIgbmV3SW1hZ2VcclxuXHRcdFNuYXAubG9hZCBcImljb25zL2ZsYWctMi5zdmdcIiwgZGVmZXIgc3RhcnRJbWFnZVxyXG5cdFx0U25hcC5sb2FkIFwiaWNvbnMvYXJyb3ctbGVmdC5zdmdcIiwgZGVmZXIgYmFja0ltYWdlXHJcblx0XHRTbmFwLmxvYWQgXCJpY29ucy9hcnJvdy1yaWdodC5zdmdcIiwgZGVmZXIgZm9yd2FyZEltYWdlXHJcblx0XHRTbmFwLmxvYWQgXCJpY29ucy9jbHVicy5zdmdcIiwgZGVmZXIgY2x1YnNfc3VpdFxyXG5cdFx0U25hcC5sb2FkIFwiaWNvbnMvZGlhbW9uZHMuc3ZnXCIsIGRlZmVyIGRpYW1vbmRzX3N1aXRcclxuXHRcdFNuYXAubG9hZCBcImljb25zL2hlYXJ0cy5zdmdcIiwgZGVmZXIgaGVhcnRzX3N1aXRcclxuXHRcdFNuYXAubG9hZCBcImljb25zL3NwYWRlcy5zdmdcIiwgZGVmZXIgc3BhZGVzX3N1aXRcclxuXHJcblx0IyAnbmV3IGRlYWwnIGJ1dHRvblxyXG5cdG5ld3N2ZyA9IG5ld0ltYWdlLnNlbGVjdCgnc3ZnJykuYXR0ciBlbmFibGVkQnV0dG9uQXR0cnNcclxuXHRAYnV0dG9ucy5uZXdEZWFsID0gQHRhYmxlLnNuYXBBcmVhLmcgbmV3c3ZnXHJcblx0LmRhdGEgJ3Rvb2xCYXJJbmRleCcsIDFcclxuXHQuZGF0YSAnaXNBY3RpdmUnLCB5ZXNcclxuXHJcblx0IyAnc3RhcnQnIGJ1dHRvblxyXG5cdHN0YXJ0c3ZnID0gc3RhcnRJbWFnZS5zZWxlY3QoJ3N2ZycpLmF0dHIgZGlzYWJsZWRCdXR0b25BdHRyc1xyXG5cdEBidXR0b25zLnN0YXJ0ID0gQHRhYmxlLnNuYXBBcmVhLmcgc3RhcnRzdmdcclxuXHQuZGF0YSAndG9vbEJhckluZGV4JywgM1xyXG5cdC5kYXRhICdpc0FjdGl2ZScsIG5vXHJcblxyXG5cdCMgJ2JhY2snIGJ1dHRvblxyXG5cdGJhY2tzdmcgPSBiYWNrSW1hZ2Uuc2VsZWN0KCdzdmcnKS5hdHRyIGRpc2FibGVkQnV0dG9uQXR0cnNcclxuXHRAYnV0dG9ucy5iYWNrID0gQHRhYmxlLnNuYXBBcmVhLmcgYmFja3N2Z1xyXG5cdC5kYXRhICd0b29sQmFySW5kZXgnLCA0XHJcblx0LmRhdGEgJ2lzQWN0aXZlJywgbm9cclxuXHJcblx0IyAnZm9yd2FyZCcgYnV0dG9uXHJcblx0Zm9yd2FyZHN2ZyA9IGZvcndhcmRJbWFnZS5zZWxlY3QoJ3N2ZycpLmF0dHIgZGlzYWJsZWRCdXR0b25BdHRyc1xyXG5cdEBidXR0b25zLmZvcndhcmQgPSBAdGFibGUuc25hcEFyZWEuZyBmb3J3YXJkc3ZnXHJcblx0LmRhdGEgJ3Rvb2xCYXJJbmRleCcsIDVcclxuXHQuZGF0YSAnaXNBY3RpdmUnLCBub1xyXG5cclxuXHQjICdzdWl0JyBidXR0b25cclxuXHRzdWl0QnV0dG9uQXR0cnMgPSB2aXNpYmlsaXR5OiAnaGlkZGVuJywgc3Ryb2tlOid3aGl0ZSdcclxuXHQsIHN0cm9rZVdpZHRoOiAuM1xyXG5cdHNwYWRlc3N2ZyA9IHNwYWRlc19zdWl0LnNlbGVjdCgnc3ZnJykuYXR0cihzdWl0QnV0dG9uQXR0cnMpLmRhdGEgJ3N1aXQnLCAncydcclxuXHRjbHVic3N2ZyA9IGNsdWJzX3N1aXQuc2VsZWN0KCdzdmcnKS5hdHRyKHN1aXRCdXR0b25BdHRycykuZGF0YSAnc3VpdCcsICdjJ1xyXG5cdGRpYW1vbmRzc3ZnID0gZGlhbW9uZHNfc3VpdC5zZWxlY3QoJ3N2ZycpLmF0dHIoc3VpdEJ1dHRvbkF0dHJzKS5kYXRhICdzdWl0JywgJ2QnXHJcblx0aGVhcnRzc3ZnID0gaGVhcnRzX3N1aXQuc2VsZWN0KCdzdmcnKS5hdHRyKHN1aXRCdXR0b25BdHRycykuZGF0YSAnc3VpdCcsICdoJ1xyXG5cdEBidXR0b25zLnN1aXQgPSBAdGFibGUuc25hcEFyZWEuZyBzcGFkZXNzdmcsIGNsdWJzc3ZnLCBkaWFtb25kc3N2ZywgaGVhcnRzc3ZnXHJcblx0QGJ1dHRvbnMuc3VpdC5kYXRhICd0b29sQmFySW5kZXgnLCAyXHJcblx0LmRhdGEgJ2lzQWN0aXZlJywgeWVzXHJcblx0LmRhdGEgJ2ltYWdlc0NvdW50JywgNFxyXG5cdC5kYXRhICdhY3RpdmVJbWFnZScsIDBcclxuXHJcblxyXG5cdCMgZm9yIGFsbCBvZiB0aGUgYnV0dG9uczpcclxuXHQjIDEpIGFkZCB0cmFuc3BhcmVudCByZWN0IHRvIHRha2UgbW91c2UgZXZlbnRzLCBhZGQgc2hhZG93XHJcblx0I1x0XHQgcGxhY2luZyBpdCBhYm92ZSBhbGwgdGhlIG90aGVyIGluIHRoZSBncm91cCB0byBlYXNpbHlcclxuXHQjXHRcdCBkZWFsIHdpdGggYSBtdWx0aS1pbWFnZWQgYnV0dG9uLCBpLmUuICdtdWx0aScgc3RhcnRzXHJcblx0I1x0XHQgZnJvbSBpbmRleCAwIHRpbGwgaW5kZXggPSBncm91cExlbmd0aCAtIDFcclxuXHQjIDIpIG1vdmUgdG8gdGhlIGluZGV4IGNvcnJlc3BvbmRpbmcgcG9zaXRpb25cclxuXHQjIDMpIG1ha2UgdmlzaWJsZVxyXG5cdCMgNCkgc2V0IGhvdmVyIGluLCBob3ZlciBvdXQsIG1vdXNlIGRvd24sIG1vdXNlIHVwIGJlaGF2aW91clxyXG5cdCMgNSkgY2xpY2sgaGFuZGxlciB3aWxsIGJlIHNldCBpbiBhcHAuaWNlZCB0byBkZWFsIHdpdGggdGhlXHJcblx0I1x0XHQgYnV0dG9uIGZ1bmN0aW9uYWxpdHkgd2l0aGluIHRoZSBhcHBsaWNhdGlvblxyXG5cclxuXHRmb3IgbiwgYiBvZiBAYnV0dG9uc1xyXG5cdFx0dXBwZXJSZWN0ID0gQHRhYmxlLnNuYXBBcmVhLnJlY3QgMCwgMCwgQGhlaWdodCwgQGhlaWdodFxyXG5cdFx0LmF0dHIgZmlsbDogJ3RyYW5zcGFyZW50J1xyXG5cdFx0Yi5hZGQgdXBwZXJSZWN0XHJcblx0XHR4U2hpZnQgPSBAbWFyZ2luICogMiArICgoYi5kYXRhICd0b29sQmFySW5kZXgnKSAtIDEpICogKDQ4ICsgQG1hcmdpbilcclxuXHRcdHRyID0gXCJ0I3t4U2hpZnR9LCN7QG1hcmdpbiAqIDJ9XCJcclxuXHRcdGIudHJhbnNmb3JtIHRyXHJcblx0XHRiLmRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nLCB0clxyXG5cdFx0Yi5kYXRhICd0b29sQmFyJywgQFxyXG5cdFx0YlswXS5hdHRyIHZpc2liaWxpdHk6ICd2aXNpYmxlJ1xyXG5cdFx0Yi5hdHRyIGZpbHRlcjogQHNoYWRvd1xyXG5cclxuXHRcdGIuaG92ZXIgKCAtPlxyXG5cdFx0XHRcdGlmIEBkYXRhICdpc0FjdGl2ZSdcclxuXHRcdFx0XHRcdCMgQHRyYW5zZm9ybSBcIiN7QGRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nfXMxLjE1XCJcclxuXHRcdFx0XHRcdEBzdG9wKCkuYW5pbWF0ZSB0cmFuc2Zvcm06IFwiI3tAZGF0YSAnY3VycmVudFRyYW5zZm9ybSd9czEuMTVcIlxyXG5cdFx0XHRcdFx0LCA1MCwgbWluYS5lYXNlaW5cclxuXHRcdFx0KSxcclxuXHRcdFx0KCAtPlxyXG5cdFx0XHRcdGlmIEBkYXRhICdpc0FjdGl2ZSdcclxuXHRcdFx0XHRcdCMgQHRyYW5zZm9ybSBcIiN7QGRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nfXMxXCJcclxuXHRcdFx0XHRcdEBzdG9wKCkuYW5pbWF0ZSB0cmFuc2Zvcm06IFwiI3tAZGF0YSAnY3VycmVudFRyYW5zZm9ybSd9czFcIlxyXG5cdFx0XHRcdFx0LCAxNTAsIG1pbmEuZWFzZW91dFxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHRiLm1vdXNlZG93biAtPlxyXG5cdFx0XHRcdGlmIEBkYXRhICdpc0FjdGl2ZSdcclxuXHRcdFx0XHRcdEB0cmFuc2Zvcm0gXCIje0BkYXRhICdjdXJyZW50VHJhbnNmb3JtJ31zLjk1dDIsMlwiXHJcblxyXG5cdFx0XHRiLm1vdXNldXAgLT5cclxuXHRcdFx0XHRpZiBAZGF0YSAnaXNBY3RpdmUnXHJcblx0XHRcdFx0XHRAdHJhbnNmb3JtIFwiI3tAZGF0YSAnY3VycmVudFRyYW5zZm9ybSd9czEuMTVcIlxyXG5cdFx0XHRcdFx0aWYgQGRhdGEgJ2ltYWdlc0NvdW50J1xyXG5cdFx0XHRcdFx0XHRjb3VudCA9IEBkYXRhICdpbWFnZXNDb3VudCdcclxuXHRcdFx0XHRcdFx0Y3VycmVudCA9IEBkYXRhICdhY3RpdmVJbWFnZSdcclxuXHRcdFx0XHRcdFx0aWYgY3VycmVudCBpcyBjb3VudCAtIDFcclxuXHRcdFx0XHRcdFx0XHRuZXh0ID0gMFxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0bmV4dCA9IGN1cnJlbnQgKyAxXHJcblx0XHRcdFx0XHRcdEBbY3VycmVudF0uYXR0ciB2aXNpYmlsaXR5OiAnaGlkZGVuJ1xyXG5cdFx0XHRcdFx0XHRAW25leHRdLmF0dHIgdmlzaWJpbGl0eTogJ3Zpc2libGUnXHJcblx0XHRcdFx0XHRcdEBkYXRhICdhY3RpdmVJbWFnZScsIG5leHRcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRAdHJhbnNmb3JtIFwiI3tAZGF0YSAnY3VycmVudFRyYW5zZm9ybSd9XCJcclxuXHJcblx0Y2IoKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb29sQmFyIiwidXRpbHMgPSByZXF1aXJlICcuL3V0aWxzJ1xyXG5cclxuY2xhc3MgVHJpY2tcclxuXHRjb25zdHJ1Y3RvcjogKEB0YWJsZSwgQHBhY2spIC0+XHJcblx0XHRAY2FyZHMgPSBbXVxyXG5cdFx0QGhhbmRzID0gW11cclxuXHRcdEBoYW5kcy5wdXNoIEB0YWJsZS5kZWFsLmZpcnN0SGFuZFxyXG5cdFx0QGhhbmRzLnB1c2ggQHRhYmxlLmdldE5leHRIYW5kIEBoYW5kc1swXVxyXG5cdFx0QGhhbmRzLnB1c2ggQHRhYmxlLmdldE5leHRIYW5kIEBoYW5kc1sxXVxyXG5cdFx0QHRyaWNrR3JvdXAgPSBbXVxyXG5cdFx0QHNoaWZ0c1JvdGF0aW9ucyA9IHt9XHJcblx0XHRAZ2V0UmFuZG9tcygpXHJcblxyXG5Ucmljazo6cmVuZGVyVHJpY2sgPSAtPlxyXG5cdGlmIEBjYXJkcy5sZW5ndGhcclxuXHRcdGZvciBlbCBpbiBAdHJpY2tHcm91cFxyXG5cdFx0XHRlbC5yZW1vdmUoKVxyXG5cdFx0QHRyaWNrR3JvdXAgPSBbXVxyXG5cdFx0c2VsZiA9IEBcclxuXHJcblx0XHRmb3IgY2FyZCBpbiBAY2FyZHNcclxuXHRcdFx0Y2FyZEdyb3VwID0gQHRhYmxlLnNuYXBBcmVhLmcoKVxyXG5cdFx0XHRjYXJkR3JvdXBcclxuXHRcdFx0XHQuZGF0YSAncGFja0luZGV4JywgY2FyZC5wYWNrSW5kZXhcclxuXHRcdFx0XHQuZGF0YSAnaGFuZCcsIGNhcmQuaGFuZFxyXG5cdFx0XHRcdC5kYXRhICd0cmljaycsIHNlbGZcclxuXHRcdFx0XHQuYWRkIHNlbGYucGFjay5jYXJkc1tjYXJkLnBhY2tJbmRleF0ucGljLnNlbGVjdCgnc3ZnJykuY2xvbmUoKVxyXG5cdFx0XHRAdHJpY2tHcm91cC5wdXNoIGNhcmRHcm91cFxyXG5cclxuXHRcdGZvciBlbCBpbiBAdHJpY2tHcm91cFxyXG5cdFx0XHRlbC50cmFuc2Zvcm0gXCJ0MCwwczEsMCwwcjAsMCwwXCJcclxuXHRcdFx0aGFuZE5hbWUgPSBlbC5kYXRhICdoYW5kJ1xyXG5cdFx0XHRoYW5kID0gQHRhYmxlLmhhbmRzW1wiI3toYW5kTmFtZX1cIl1cclxuXHRcdFx0dHJpY2tYID0gaGFuZC50YWJsZS5jb29yZHMuY2VudGVyLnggLVxyXG5cdFx0XHRcdEBzaGlmdHNSb3RhdGlvbnNbXCIje2hhbmQuc2VhdH1cIl0uc2hpZnQueFxyXG5cdFx0XHR0cmlja1kgPSBoYW5kLnRhYmxlLmNvb3Jkcy5ub3J0aC55IC1cclxuXHRcdFx0XHRAc2hpZnRzUm90YXRpb25zW1wiI3toYW5kLnNlYXR9XCJdLnNoaWZ0LnlcclxuXHRcdFx0dHIgPSBcInQje3RyaWNrWH0sI3t0cmlja1l9XCIgK1xyXG5cdFx0XHRcInMje2hhbmQudGFibGUuY2FyZFNpemVSYXRpb31cIiArXHJcblx0XHRcdFwiciN7QHNoaWZ0c1JvdGF0aW9uc1tcIiN7aGFuZC5zZWF0fVwiXS5yb3RhdGlvbn1cIlxyXG5cdFx0XHRlbC50cmFuc2Zvcm0gdHJcclxuXHJcblRyaWNrOjphbmltYXRlVHJpY2tUb0hhbmQgPSAoYW5pbUR1cmF0aW9uLCBoYW5kKSAtPlxyXG5cdHNlbGYgPSBAXHJcblx0aWYgQGNhcmRzLmxlbmd0aCBpcyAzXHJcblx0XHQjIGluaXRpYWxpemluZyBiYWNrIG9iamVjdFxyXG5cdFx0YmFjayA9IEB0YWJsZS5zbmFwQXJlYS5nKClcclxuXHRcdCMgbW92ZXMgYWxsIDMgdHJpY2sgY2FyZHMgdG8gaGVhcFxyXG5cdFx0c2V0VGltZW91dCAoLT5cclxuXHRcdFx0Zm9yIGVsIGluIHNlbGYudHJpY2tHcm91cFxyXG5cdFx0XHRcdGVsLnN0b3AoKVxyXG5cdFx0XHRcdC5hbmltYXRlIHRyYW5zZm9ybTogXCJUI3tzZWxmLnRhYmxlLmNvb3Jkcy5jZW50ZXIueH1cclxuXHRcdFx0XHQsI3tzZWxmLnRhYmxlLmNvb3Jkcy5ub3J0aC55fVMje3NlbGYudGFibGUuY2FyZFNpemVSYXRpb31SMFwiXHJcblx0XHRcdFx0LCBhbmltRHVyYXRpb24gKiAuMiwgbWluYS5lYXNlaW5cclxuXHRcdFx0KSwgYW5pbUR1cmF0aW9uICogLjJcclxuXHRcdCMgcmVtb3ZlcyBmaXJzdCB0d28gbG93ZXIgY2FyZHMgc2luY2UgdGhlcmUncyBubyBuZWVkIG9mIHRoZW1cclxuXHRcdHNldFRpbWVvdXQgKC0+XHJcblx0XHRcdFx0Zm9yIGVsLCBpIGluIHNlbGYudHJpY2tHcm91cCB3aGVuIGkgaXNudCAyXHJcblx0XHRcdFx0XHRlbC5yZW1vdmUoKVxyXG5cdFx0XHQpLCBhbmltRHVyYXRpb24gKiAuNFxyXG5cdFx0IyBzaHJpbmtzIHRoZSByZW1haW5pbmcgdXBwZXIgY2FyZCwgMXN0IHBoYXNlIG9mIGZvbGRpbmdcclxuXHRcdHNldFRpbWVvdXQgKC0+XHJcblx0XHRcdHNlbGYudHJpY2tHcm91cFsyXS5zdG9wKClcclxuXHRcdFx0LmFuaW1hdGUgdHJhbnNmb3JtOiBcInQje3NlbGYudGFibGUuY29vcmRzLmNlbnRlci54fVxyXG5cdFx0XHQsI3tzZWxmLnRhYmxlLmNvb3Jkcy5ub3J0aC55fXMuMDAwMVxyXG5cdFx0XHQsI3tzZWxmLnRhYmxlLmNhcmRTaXplUmF0aW99cjBcIiwgYW5pbUR1cmF0aW9uICogLjJcclxuXHRcdFx0IyByZW1vdmVzIHRoZSBsYXN0IHRyaWNrIGNhcmRcclxuXHRcdFx0c2V0VGltZW91dCAoLT5cclxuXHRcdFx0XHRzZWxmLnRyaWNrR3JvdXBbMl0ucmVtb3ZlKClcclxuXHRcdFx0XHRzZWxmLnRyaWNrR3JvdXAgPSBbXVxyXG5cdFx0XHRcdCksIGFuaW1EdXJhdGlvbiAqIC4yICsgMTBcclxuXHRcdFx0KSwgYW5pbUR1cmF0aW9uICogLjZcclxuXHRcdCMgYWRkcyBhbmltYXRpbmcgYmFja1xyXG5cdFx0c2V0VGltZW91dCAoLT5cclxuXHRcdFx0YmFjay5hZGQgc2VsZi5wYWNrLmJhY2tCbHVlLmNsb25lKClcclxuXHRcdFx0YmFjay5hdHRyIHZpc2liaWxpdHk6ICdoaWRkZW4nXHJcblx0XHRcdGJhY2sudHJhbnNmb3JtIFwicy4wMDAxLCN7c2VsZi50YWJsZS5jYXJkU2l6ZVJhdGlvfXIwXFxcclxuXHRcdFx0VCN7c2VsZi50YWJsZS5jb29yZHMuY2VudGVyLnh9LCN7c2VsZi50YWJsZS5jb29yZHMubm9ydGgueX1cIlxyXG5cclxuXHRcdFx0YmFjay5hdHRyIHZpc2liaWxpdHk6J3Zpc2libGUnXHJcblx0XHRcdGJhY2suc3RvcCgpLmFuaW1hdGUgdHJhbnNmb3JtOiBcInMje3NlbGYudGFibGUuY2FyZFNpemVSYXRpb31cclxuXHRcdFx0LCN7c2VsZi50YWJsZS5jYXJkU2l6ZVJhdGlvfXIwVCN7c2VsZi50YWJsZS5jb29yZHMuY2VudGVyLnh9XHJcblx0XHRcdCwje3NlbGYudGFibGUuY29vcmRzLm5vcnRoLnl9XCIsIGFuaW1EdXJhdGlvbiAqIC4yXHJcblx0XHRcdCksIGFuaW1EdXJhdGlvbiAqIC44XHJcblx0XHQjIG1vdmVzIGJhY2sgdG8gaGFuZCB0cmlja3NcclxuXHRcdHNldFRpbWVvdXQgKC0+XHJcblx0XHRcdHRyID0gaGFuZC5nZXRUcmlja0Nvb3JkcyAoaGFuZC50cmlja3MubGVuZ3RoIC0gMSlcclxuXHRcdFx0YmFjay5zdG9wKCkuYW5pbWF0ZSB0cmFuc2Zvcm06IHRyWzJdLCBhbmltRHVyYXRpb24gKiAuMlxyXG5cdFx0XHRzZXRUaW1lb3V0ICgtPlxyXG5cdFx0XHRcdGJhY2sucmVtb3ZlKClcclxuXHRcdFx0XHQpLCBhbmltRHVyYXRpb24gKiAuMiArIDEwXHJcblx0XHRcdCksIGFuaW1EdXJhdGlvblxyXG5cclxuVHJpY2s6OmdldFJhbmRvbXMgPSAtPlxyXG5cdCMgdGhpbmsgdXNpbmcgQHRhYmxlLmNhcmRXaWR0aC9IZWlnaHQgaW5zdGVhZCEhISBiYWQgbG9va2luZyBvbiBkaWZmZXJlbnQgc2NyZWVuIHNpemVzXHJcblx0QHNoaWZ0c1JvdGF0aW9ucy53ZXN0ID0gIyDQsdGD0LvQviDQt9C80ZbRidC10L3QvdGPIC4xNSwg0LfQsNGA0LDQtyAuMzVcclxuXHRcdHJvdGF0aW9uOiAodXRpbHMuZ2V0UmFuZG9tSW50IDEsIDUpICogMzYwIC0gNTQgLSAodXRpbHMuZ2V0UmFuZG9tSW50IDAsIDkpICogMS41XHJcblx0XHRzaGlmdDpcclxuXHRcdFx0eDogKEBwYWNrLmNhcmRXaWR0aCAqIC4zNSkgLSAodXRpbHMuZ2V0UmFuZG9tSW50IDAsIDYpICogMC4wMyAqIEBwYWNrLmNhcmRXaWR0aFxyXG5cdFx0XHR5OiAwXHJcblx0QHNoaWZ0c1JvdGF0aW9ucy5zb3V0aCA9XHJcblx0XHRyb3RhdGlvbjogKHV0aWxzLmdldFJhbmRvbUludCAxLCA1KSAqIDM1NCArICh1dGlscy5nZXRSYW5kb21JbnQgMCwgOSkgKiAxLjVcclxuXHRcdHNoaWZ0OlxyXG5cdFx0XHR4OiAwXHJcblx0XHRcdHk6IChAcGFjay5jYXJkSGVpZ2h0ICogLjM1KSAtICh1dGlscy5nZXRSYW5kb21JbnQgMCwgNikgKiAwLjAzICogQHBhY2suY2FyZEhlaWdodFxyXG5cdEBzaGlmdHNSb3RhdGlvbnMuZWFzdCA9XHJcblx0XHRyb3RhdGlvbjogKHV0aWxzLmdldFJhbmRvbUludCAxLCA1KSAqIDM2MCArIDU0ICsgKHV0aWxzLmdldFJhbmRvbUludCAwLCA5KSAqIDEuNVxyXG5cdFx0c2hpZnQ6XHJcblx0XHRcdHg6IChAcGFjay5jYXJkV2lkdGggKiAtLjM1KSArICh1dGlscy5nZXRSYW5kb21JbnQgMCwgNikgKiAwLjAzICogQHBhY2suY2FyZFdpZHRoXHJcblx0XHRcdHk6IDBcclxuXHJcblRyaWNrOjpnZXRXaW5uZXJDYXJkID0gLT5cclxuXHRzZWxmID0gQFxyXG5cdGNvbXBhcmVDYXJkcyA9IChmaXJzdCwgc2Vjb25kKSAtPlxyXG5cdFx0aWYgZmlyc3Quc3VpdCBpc250IHNlbGYudGFibGUuZGVhbC50cnVtcFxyXG5cdFx0XHRpZiBzZWNvbmQuc3VpdCBpc250IHNlbGYudGFibGUuZGVhbC50cnVtcFxyXG5cdFx0XHRcdGlmIHNlY29uZC5zdWl0IGlzIGZpcnN0LnN1aXRcclxuXHRcdFx0XHRcdGlmIChzZWxmLnBhY2suc29ydFZhbHVlcy5pbmRleE9mIGZpcnN0LnZhbHVlKSA+IChzZWxmLnBhY2suc29ydFZhbHVlcy5pbmRleE9mIHNlY29uZC52YWx1ZSlcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZpcnN0XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiBzZWNvbmRcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gZmlyc3RcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBzZWNvbmRcclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgc2Vjb25kLnN1aXQgaXNudCBzZWxmLnRhYmxlLmRlYWwudHJ1bXBcclxuXHRcdFx0XHRyZXR1cm4gZmlyc3RcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIChzZWxmLnBhY2suc29ydFZhbHVlcy5pbmRleE9mIGZpcnN0LnZhbHVlKSA+IChzZWxmLnBhY2suc29ydFZhbHVlcy5pbmRleE9mIHNlY29uZC52YWx1ZSlcclxuXHRcdFx0XHRcdHJldHVybiBmaXJzdFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBzZWNvbmRcclxuXHRjb21wYXJlQ2FyZHMgKGNvbXBhcmVDYXJkcyBAY2FyZHNbMF0sIEBjYXJkc1sxXSksIEBjYXJkc1syXVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUcmljayIsIlRvb2xCYXIgPSByZXF1aXJlICcuL1Rvb2xCYXInXHJcblBhY2sgPSByZXF1aXJlICcuL1BhY2snXHJcbkhhbmQgPSByZXF1aXJlICcuL0hhbmQnXHJcblRhYmxlID0gcmVxdWlyZSAnLi9UYWJsZSdcclxuQ2FyZFJvdyA9IHJlcXVpcmUgJy4vQ2FyZFJvdydcclxuVHJpY2sgPSByZXF1aXJlICcuL1RyaWNrJ1xyXG51dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMnXHJcblxyXG5hd2FpdCBwYWNrID0gbmV3IFBhY2sgZGVmZXIgY2FyZHNcclxuXHJcbnRhYmxlID0gbmV3IFRhYmxlIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIHBhY2tcclxudGFibGUudHJ1bXAgPSAncydcclxuXHJcbmF3YWl0IHRvb2xCYXIgPSBuZXcgVG9vbEJhciB0YWJsZSwgZGVmZXIgdGJcclxuXHJcbiMgYnV0dG9ucyA9IFsnZG9jdW1lbnQnLCAnZmxhZy0yJywgJ2Fycm93LWxlZnQnLCAnYXJyb3ctcmlnaHQnXVxyXG4jIGJ1dHRvbkZyYWdtZW50cyA9IFtdXHJcbiMgYnV0dG9uUGljcyA9IFtdXHJcblxyXG4jIGYgPSB0YWJsZS5zbmFwQXJlYS5maWx0ZXIgU25hcC5maWx0ZXIuc2hhZG93IDcsNywzLCdibGFjaycsLjhcclxuIyBidXR0b25BdHRycyA9IGZpbGw6ICd3aGl0ZScsIHN0cm9rZTogJ2JsYWNrJywgc3Ryb2tlV2lkdGg6IDFcclxuXHJcbiMgYXdhaXRcclxuIyBcdGZvciBiLGkgaW4gYnV0dG9uc1xyXG4jIFx0XHRTbmFwLmxvYWQgXCJpY29ucy8je2J9LnN2Z1wiLCBkZWZlciBidXR0b25GcmFnbWVudHNbaV1cclxuXHJcbiMgZm9yIGZyYWdtZW50LCBpIGluIGJ1dHRvbkZyYWdtZW50c1xyXG4jIFx0ZG8gKGZyYWdtZW50KSAtPlxyXG4jIFx0XHRlbCA9IGZyYWdtZW50LnNlbGVjdCgnc3ZnJylcclxuIyBcdFx0YnV0dG9uID0gdGFibGUuc25hcEFyZWEuZygpXHJcbiMgXHRcdGJ1dHRvbi5hZGQgZWxcclxuIyBcdFx0ZWxXaWR0aCA9IGJ1dHRvbi5nZXRCQm94KCkud2lkdGhcclxuIyBcdFx0ZWxIZWlnaHQgPSBidXR0b24uZ2V0QkJveCgpLmhlaWdodFxyXG4jIFx0XHRyZWN0ID0gdGFibGUuc25hcEFyZWEucmVjdCAwLCAwLCBlbFdpZHRoLCBlbEhlaWdodFxyXG4jIFx0XHRyZWN0LmF0dHIgZmlsbDogJ3RyYW5zcGFyZW50J1xyXG4jIFx0XHRidXR0b24uYWRkIHJlY3RcclxuIyBcdFx0YnV0dG9uLmRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nLCBcInQjezEwICsgaSAqIDU4fSwxMFwiXHJcbiMgXHRcdGJ1dHRvbi50cmFuc2Zvcm0gXCIje2J1dHRvbi5kYXRhICdjdXJyZW50VHJhbnNmb3JtJ31cIlxyXG4jIFx0XHRlbC5hdHRyIGJ1dHRvbkF0dHJzXHJcbiMgXHRcdGJ1dHRvbi5hdHRyIGZpbHRlcjogZlxyXG4jIFx0XHRidXR0b24ubW91c2Vkb3duIC0+XHJcbiMgXHRcdFx0QGRhdGEgJ21vdXNlZG93bicsIHllc1xyXG4jIFx0XHRcdEB0cmFuc2Zvcm0gXCIje2J1dHRvbi5kYXRhICdjdXJyZW50VHJhbnNmb3JtJ31zLjk1dDIsMlwiXHJcbiMgXHRcdGJ1dHRvbi5tb3VzZXVwIC0+XHJcbiMgXHRcdFx0QHRyYW5zZm9ybSBcIiN7YnV0dG9uLmRhdGEgJ2N1cnJlbnRUcmFuc2Zvcm0nfVwiXHJcbiMgXHRcdGJ1dHRvbi5ob3ZlciAoLT5cclxuIyBcdFx0XHRidXR0b25bMF0uYXR0ciBmaWxsOiAnI2YwMCcpXHJcbiMgXHRcdFx0LCgtPlxyXG4jIFx0XHRcdFx0YnV0dG9uWzBdLmF0dHIgZmlsbDogJ3doaXRlJyMsICdmaWxsLW9wYWNpdHknOiAxXHJcbiMgXHRcdFx0XHRpZiBAZGF0YSAnbW91c2Vkb3duJ1xyXG4jIFx0XHRcdFx0XHRAdHJhbnNmb3JtIFwiI3tidXR0b24uZGF0YSAnY3VycmVudFRyYW5zZm9ybSd9XCJcclxuIyBcdFx0XHRcdFx0QGRhdGEgJ21vdXNlZG93bicsIG5vKVxyXG4jIFx0XHRidXR0b25QaWNzLnB1c2ggYnV0dG9uXHJcblxyXG4jIGJ1dHRvblBpY3NbMF0uY2xpY2sgLT5cclxuIyBcdHN0YXJ0RGVhbGluZygpXHJcblxyXG50b29sQmFyLmJ1dHRvbnMubmV3RGVhbC5jbGljayAtPlxyXG5cdHRiID0gQGRhdGEgJ3Rvb2xCYXInXHJcblx0dGIuYnV0dG9ucy5zdWl0LmRhdGEgJ2lzQWN0aXZlJywgeWVzXHJcblx0c3RhcnREZWFsaW5nKClcclxuXHJcbnRvb2xCYXIuYnV0dG9ucy5zdWl0LmNsaWNrIC0+XHJcblx0dGFibGUudHJ1bXAgPSBAW0BkYXRhICdhY3RpdmVJbWFnZSddLmRhdGEgJ3N1aXQnXHJcblxyXG50b29sQmFyLmJ1dHRvbnMuc3RhcnQuY2xpY2sgLT5cclxuXHRAZGF0YSAnaXNBY3RpdmUnLCBub1xyXG5cdEB0cmFuc2Zvcm0gXCIje0BkYXRhICdjdXJyZW50VHJhbnNmb3JtJ31cIlxyXG5cdEBbMF0uYXR0ciBmaWxsOiAnIzQ0NCcgIyBvYnZpb3VzbHkgbmVlZHMgdG8gYmUgbW92ZWQgdG8gVG9vbEJhciBzb21laG93XHJcblx0dGIgPSBAZGF0YSAndG9vbEJhcidcclxuXHR0Yi5idXR0b25zLnN1aXQuZGF0YSAnaXNBY3RpdmUnLCBub1xyXG5cdHRhYmxlLmFwcE1vZGUgPSAnbW92aW5nJ1xyXG5cdHRhYmxlLmRlYWwgPSB7fVxyXG5cdHRhYmxlLmRlYWwudHJpY2tzID0gW11cclxuXHR0YWJsZS5kZWFsLnRydW1wID0gdGFibGUudHJ1bXBcclxuXHR0YWJsZS5kZWFsLmZpcnN0SGFuZCA9ICd3ZXN0J1xyXG5cdHRhYmxlLmRlYWwudHJpY2tzLnB1c2ggbmV3IFRyaWNrIHRhYmxlLCBwYWNrXHJcblx0Zm9yIGhhbmQgaW4gdGFibGUuZGVhbC50cmlja3NbMF0uaGFuZHNcclxuXHRcdHRhYmxlLmhhbmRzW1wiI3toYW5kfVwiXS51blNldEhvdmVycygpXHJcblx0XHR0YWJsZS5oYW5kc1tcIiN7aGFuZH1cIl0udW5TZXREcmFncygpXHJcblx0IyDQt9C90Y/RgtC4INC+0LHRgNC+0LHQu9GO0LLQsNGH0ZYg0Lcg0YPRgdGW0YUg0YDRg9C6ISEhXHJcblx0dGFibGUuaGFuZHNbXCIje3RhYmxlLmRlYWwuZmlyc3RIYW5kfVwiXS5iaW5kTW92ZXNUb1RyaWNrKClcclxuXHRmb3IgZWwgaW4gdGFibGUuY2FyZFJvdy5jYXJkUm93R3JvdXBcclxuXHRcdGVsLnJlbW92ZSgpXHJcblx0dGFibGUuY2FyZFJvdyA9IG51bGxcclxuXHJcbiMgYnV0dG9uUGljc1sxXS5jbGljayAtPlxyXG4jIFx0dGFibGUuYXBwTW9kZSA9ICdtb3ZpbmcnXHJcbiMgXHR0YWJsZS5kZWFsID0ge31cclxuIyBcdHRhYmxlLmRlYWwudHJpY2tzID0gW11cclxuIyBcdHRhYmxlLmRlYWwudHJ1bXAgPSAnZCdcclxuIyBcdHRhYmxlLmRlYWwuZmlyc3RIYW5kID0gJ3dlc3QnXHJcbiMgXHR0YWJsZS5kZWFsLnRyaWNrcy5wdXNoIG5ldyBUcmljayB0YWJsZSwgcGFja1xyXG4jIFx0Zm9yIGhhbmQgaW4gdGFibGUuZGVhbC50cmlja3NbMF0uaGFuZHNcclxuIyBcdFx0dGFibGUuaGFuZHNbXCIje2hhbmR9XCJdLnVuU2V0SG92ZXJzKClcclxuIyBcdFx0dGFibGUuaGFuZHNbXCIje2hhbmR9XCJdLnVuU2V0RHJhZ3MoKVxyXG4jIFx0IyDQt9C90Y/RgtC4INC+0LHRgNC+0LHQu9GO0LLQsNGH0ZYg0Lcg0YPRgdGW0YUg0YDRg9C6ISEhXHJcbiMgXHR0YWJsZS5oYW5kc1tcIiN7dGFibGUuZGVhbC5maXJzdEhhbmR9XCJdLmJpbmRNb3Zlc1RvVHJpY2soKVxyXG4jIFx0YnV0dG9uUGljc1sxXVswXS5hdHRyIGZpbGw6ICdncmV5J1xyXG4jIFx0Zm9yIGVsIGluIHRhYmxlLmNhcmRSb3cuY2FyZFJvd0dyb3VwXHJcbiMgXHRcdGVsLnJlbW92ZSgpXHJcbiMgXHR0YWJsZS5jYXJkUm93ID0gbnVsbFxyXG4jIFx0bnVsbFxyXG5cclxuIyBwYWNrLnNodWZmbGUoKVxyXG5cclxuc3RhcnREZWFsaW5nID0gLT5cclxuXHR0YWJsZS5hcHBNb2RlID0gJ2RlYWxpbmcnXHJcblx0Zm9yIG5hbWUsIGhhbmQgb2YgdGFibGUuaGFuZHNcclxuXHRcdGhhbmQuaGFuZENhcmRzQ291bnRlci5yZW1vdmUoKVxyXG5cdFx0Zm9yIGVsIGluIGhhbmQuaGFuZEdyb3VwXHJcblx0XHRcdGVsLnJlbW92ZSgpXHJcblx0XHRmb3IgZWwgaW4gaGFuZC50cmlja3NHcm91cFxyXG5cdFx0XHRlbC5yZW1vdmUoKVxyXG5cdHRhYmxlLmNhcmRSb3cgPSBuZXcgQ2FyZFJvdyB0YWJsZSwgcGFja1xyXG5cdHRhYmxlLmhhbmRzLndlc3QgPSBuZXcgSGFuZCB0b29sQmFyLCB0YWJsZSwgcGFjaywgJ3dlc3QnLCB0YWJsZS5hcHBNb2RlXHJcblx0dGFibGUuaGFuZHMuZWFzdCA9IG5ldyBIYW5kIHRvb2xCYXIsIHRhYmxlLCBwYWNrLCAnZWFzdCcsIHRhYmxlLmFwcE1vZGVcclxuXHR0YWJsZS5oYW5kcy5zb3V0aCA9IG5ldyBIYW5kIHRvb2xCYXIsIHRhYmxlLCBwYWNrLCAnc291dGgnLCB0YWJsZS5hcHBNb2RlXHJcblx0bnVsbFxyXG5cclxuc3RhcnREZWFsaW5nKClcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCAtPlxyXG5cdHRhYmxlLmdldENvb3JkcyB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0XHJcblx0dGFibGUuY2FyZFJvdz8ucmVuZGVyQ2FyZFJvdygpXHJcblx0bGFzdFRyaWNrID0gdGFibGUuZGVhbD8udHJpY2tzW3RhYmxlLmRlYWwudHJpY2tzLmxlbmd0aCAtIDFdXHJcblx0bGFzdFRyaWNrPy5yZW5kZXJUcmljaygpXHJcblx0Zm9yIG5hbWUsIGhhbmQgb2YgdGFibGUuaGFuZHNcclxuXHRcdGlmIHRhYmxlLmFwcE1vZGUgaXMgJ21vdmluZydcclxuXHRcdFx0aGFuZC5yZW5kZXJUcmlja3MoKVxyXG5cclxuXHRcdCMgbm8gbmVlZCB0byByZW5kZXIgZmFuRnJhbWUgaW4gJ21vdmluZycgbW9kZVxyXG5cdFx0IyBpbXBsZW1lbnRlZCBub3QgdGhyb3VnaCBcImlmLi4uZWxzZS4uLlwiIHNpbmNlXHJcblx0XHQjIDEpIHRyaWNrcyBzaG91bGQgYmUgdW5kZXIgYSBoYW5kcycgY2FyZHNcclxuXHRcdCMgc28gcmVuZGVySGFuZCgpIHNob3VsZCBnbyBhZnRlciByZW5kZXJUcmlja3MoKVxyXG5cdFx0IyAyKSBpbiAnZGVhbGluZycgbW9kZSBob3ZlcnMgYW5kIGRyYWdzIGNhbiBiZVxyXG5cdFx0IyBzZXQgcmlnaHQgYWZ0ZXIgcmVuZGVyaW5nIGNhcmRzXHJcblx0XHQjIDMpIHRob3VnaCBpbiAnbW92aW5nJyBtb2RlIGhvdmVycy9kcmFncyBhcmVcclxuXHRcdCMgc2V0IGRlcGVuZGluZyBvbiB0aGUgY3VycmVudCB0cmljaydzIGNhcmRzXHJcblx0XHQjIG51bWJlclxyXG5cclxuXHRcdGhhbmQucmVuZGVySGFuZCgpXHJcblxyXG5cdFx0aWYgdGFibGUuYXBwTW9kZSBpcyAnZGVhbGluZydcclxuXHRcdFx0aGFuZC5yZW5kZXJGYW5GcmFtZSgpXHJcblx0XHRcdGhhbmQuc2V0SG92ZXJzKClcclxuXHRcdFx0aGFuZC5zZXREcmFncygpXHJcblxyXG5cdGlmIHRhYmxlLmFwcE1vZGUgaXMgJ21vdmluZydcclxuXHRcdHN3aXRjaCBsYXN0VHJpY2suY2FyZHMubGVuZ3RoXHJcblx0XHRcdCMgdGhlcmUncyBubyBuZWVkIHRvIHVuc2V0IGV2ZW50IGhhbmRsZXJzXHJcblx0XHRcdCMgYXMgYSBoYW5kJ3MgZmFuIGlzIGJ1aWx0IGZyb20gc2NyYXRjaFxyXG5cdFx0XHQjIGFsc28gbm8gbmVlZCB0byBnZXQgYWxsb3dlZCBzdWl0IGZvciBhXHJcblx0XHRcdCMgaGFuZCBhcyBpdCBoYXMgYmVlbiBzZXQgdXBvbiBmaXJzdFxyXG5cdFx0XHQjIEhhbmQuc2V0SG92ZXJzKClcclxuXHRcdFx0d2hlbiAwXHJcblx0XHRcdFx0IyBlbXB0eSB0cmljaywgc2V0dGluZyBmb3IgdGhlIDFzdCBoYW5kXHJcblx0XHRcdFx0dGFibGUuaGFuZHNbXCIje2xhc3RUcmljay5oYW5kc1swXX1cIl0uc2V0SG92ZXJzKClcclxuXHRcdFx0XHR0YWJsZS5oYW5kc1tcIiN7bGFzdFRyaWNrLmhhbmRzWzBdfVwiXS5zZXREcmFncygpXHJcblx0XHRcdHdoZW4gMVxyXG5cdFx0XHRcdCMgc2V0IGZvciB0aGUgdGhlIHNlY29uZCBhbmQgdGhpcmRcclxuXHRcdFx0XHR0YWJsZS5oYW5kc1tcIiN7bGFzdFRyaWNrLmhhbmRzWzFdfVwiXS5zZXRIb3ZlcnMoKVxyXG5cdFx0XHRcdHRhYmxlLmhhbmRzW1wiI3tsYXN0VHJpY2suaGFuZHNbMV19XCJdLnNldERyYWdzKClcclxuXHRcdFx0XHR0YWJsZS5oYW5kc1tcIiN7bGFzdFRyaWNrLmhhbmRzWzJdfVwiXS5zZXRIb3ZlcnMoKVxyXG5cdFx0XHR3aGVuIDJcclxuXHRcdFx0XHQjIHRoZSAzcmRcclxuXHRcdFx0XHR0YWJsZS5oYW5kc1tcIiN7bGFzdFRyaWNrLmhhbmRzWzJdfVwiXS5zZXRIb3ZlcnMoKVxyXG5cdFx0XHRcdHRhYmxlLmhhbmRzW1wiI3tsYXN0VHJpY2suaGFuZHNbMl19XCJdLnNldERyYWdzKClcclxuXHRcdFx0IyB3aGVuIDNcclxuXHRcdFx0XHQjIHN1cHBvc2UgdXNlcidsbCBoYXZlIG5vIHRpbWUgdG8gcmVzaXplIHRpbGxcclxuXHRcdFx0XHQjIGFuaW1hdGlvbiBmaW5pc2hlc1xyXG4iLCJBcnJheTo6dW5pcXVlID0gLT5cclxuXHRuID0ge31cclxuXHRyID0gW11cclxuXHRmb3IgZWwsIGkgaW4gQFxyXG5cdFx0dW5sZXNzIG5bQFtpXV1cclxuXHRcdFx0bltAW2ldXSA9IG9uXHJcblx0XHRcdHIucHVzaCBAW2ldXHJcblx0clxyXG5cclxuQXJyYXk6OmV4aXN0cyA9ICh2YWwpIC0+XHJcblx0aWYgQGluZGV4T2YodmFsKSA+PSAwIHRoZW4geWVzIGVsc2Ugbm9cclxuXHJcbkFycmF5OjpnZXROZXh0T3JGaXJzdEl0ZW0gPSAoaXRlbSkgLT5cclxuXHRpZiBAWyhALmluZGV4T2YgaXRlbSkgKyAxXVxyXG5cdFx0cmV0dXJuIEBbKEAuaW5kZXhPZiBpdGVtKSArIDFdXHJcblx0ZWxzZVxyXG5cdFx0cmV0dXJuIEBbMF0iLCJleHBvcnRzLmdldFJhbmRvbUludCA9IChtaW4sIG1heCkgLT4gIyBtaW4g0LLQutC70Y7Rh9Cw0Y7Rh9C4IG1pbiwg0LLQuNC60LvRjtGH0LDRjtGH0LggbWF4XHJcblx0KE1hdGguZmxvb3IgTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pblxyXG5cclxuIyDRhtC1INGE0YPQvdC60YbRltGPLCDRj9C60LAg0L/RgNC40LnQvNCw0ZQg0LrQvtC+0YDQtNC40L3QsNGC0Lgg0YbQtdC90YLRgNGDLFxyXG4jINGA0LDQtNGW0YPRgSAo0LPRltC/0L7RgtC10L3Rg9C30LApLCDRgtCwINC60YPRgiwg0LAg0L/QvtCy0LXRgNGC0LDRlFxyXG4jINCy0ZbQtNC/0L7QstGW0LTQvdGDINGC0L7Rh9C60YNcclxucG9sYXJUb0NhcnRlc2lhbiA9IChjeCwgY3ksIHIsIGFuZ2xlKSAtPlxyXG5cdGFuZ2xlID0gKGFuZ2xlIC0gOTApICogTWF0aC5QSSAvIDE4MFxyXG5cdCMg0L3QsNGB0YLRg9C/0L3QtSDQvtC30L3QsNGH0LDRlDog0L/QvtCy0LXRgNC90YPRgtC4INGC0LDQutC40Lkg0L7QsSfRlNC60YJcclxuXHR4OiBjeCArIHIgKiBNYXRoLmNvcyBhbmdsZVxyXG5cdHk6IGN5ICsgciAqIE1hdGguc2luIGFuZ2xlXHJcblxyXG4jINCwINGG0Y8g0YTRg9C90LrRhtGW0Y8sINCy0LvQsNGB0L3QtSwg0LzQsNC70Y7RlCDQtNGD0LPRgywg0L7RgtGA0LjQvNGD0Y7Rh9C4XHJcbiMg0LrQvtC+0YDQtNC40L3QsNGC0Lgg0ZfRlyDQv9C+0YfQsNGC0LrRgywg0LrRltC90YbRjywg0LrRg9GCINCx0LXRgNC10YLRjNGB0Y8g0ZbQt1xyXG4jINGA0L7Qt9GA0LDRhdGD0L3QutGDINC50L7Qs9C+INC30LDQu9C40YjQutGDINCy0ZbQtCDQv9C+0LTRltC70LXQvdC90Y8g0L3QsCAzNjAsXHJcbiMg0YLQvtCx0YLQviA0MjA9NjAsINCyINC30LDQu9C10LbQvdC+0YHRgtGWINCy0ZbQtCDRgNGW0LfQvdC+0YHRgtGWINC60YPRgtGW0LJcclxuIyDQt9Cw0LLQttC00Lgg0LzQsNC70Y7RlNC80L4g0LzQsNC70LXQvdGM0LrRgyDQtNGD0LPRg1xyXG4jINGJ0L7QsSDQvdCw0LzQsNC70Y7QstCw0YLQuCDRgdCw0LzQtSDRgdC10LrRgtC+0YAsINGC0YDQtdCx0LAg0LTQvtC00LDRgtC4INGJ0LUgNtC5XHJcbiMgYm9vbCDQsNGA0LPRg9C80LXQvdGCLCDRj9C60LjQuSDQstC40LfQvdCw0YfQsNGULCDRh9C4INC80LDQu9GO0LLQsNGC0LhcclxuIyDQv9GA0L7QtNC+0LLQttC10L3QvdGPINGI0LvRj9GF0YMsINGH0Lgg0YbQtSDQv9C+0YfQsNGC0L7QuiDQvNCw0LvRjtCy0LDQvdC90Y8gKEwg0LDQsdC+INCcKVxyXG5kZXNjcmliZUFyYyA9ICh4LCB5LCByLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY29udGludWVMaW5lKSAtPlxyXG5cdHN0YXJ0ID0gcG9sYXJUb0NhcnRlc2lhbiB4LCB5LCByLCBzdGFydEFuZ2xlICU9IDM2MFxyXG5cdGVuZCA9IHBvbGFyVG9DYXJ0ZXNpYW4geCwgeSwgciwgZW5kQW5nbGUgJT0gMzYwXHJcblx0bGFyZ2UgPSBNYXRoLmFicyhlbmRBbmdsZSAtIHN0YXJ0QW5nbGUpID49IDE4MFxyXG5cdGFsdGVyID0gZW5kQW5nbGUgPiBzdGFydEFuZ2xlXHJcblx0XCIje2lmIGNvbnRpbnVlTGluZSB0aGVuICdMJyBlbHNlICdNJ30je3N0YXJ0Lnh9LCN7c3RhcnQueX1cclxuXHRBI3tyfSwje3J9LDAsXHJcblx0I3tpZiBsYXJnZSB0aGVuIDEgZWxzZSAwfSxcclxuXHQje2lmIGFsdGVyIHRoZW4gMSBlbHNlIDB9LCAje2VuZC54fSwje2VuZC55fVwiXHJcblxyXG5leHBvcnRzLmRlc2NyaWJlU2VjdG9yID0gKHgsIHksIHIsIHIyLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSkgLT5cclxuXHRcIiN7ZGVzY3JpYmVBcmMgeCwgeSwgciwgc3RhcnRBbmdsZSwgZW5kQW5nbGV9XHJcblx0I3tkZXNjcmliZUFyYyB4LCB5LCByMiwgZW5kQW5nbGUsIHN0YXJ0QW5nbGUsIG9ufVpcIiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvLyBHZW5lcmF0ZWQgYnkgSWNlZENvZmZlZVNjcmlwdCAxLjcuMS1iXG4oZnVuY3Rpb24oKSB7XG4gIG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGs6IFwiX19pY2VkX2tcIixcbiAgICBrX25vb3A6IFwiX19pY2VkX2tfbm9vcFwiLFxuICAgIHBhcmFtOiBcIl9faWNlZF9wX1wiLFxuICAgIG5zOiBcImljZWRcIixcbiAgICBydW50aW1lOiBcInJ1bnRpbWVcIixcbiAgICBEZWZlcnJhbHM6IFwiRGVmZXJyYWxzXCIsXG4gICAgZGVmZXJyYWxzOiBcIl9faWNlZF9kZWZlcnJhbHNcIixcbiAgICBmdWxmaWxsOiBcIl9mdWxmaWxsXCIsXG4gICAgYl93aGlsZTogXCJfYnJlYWtcIixcbiAgICB0X3doaWxlOiBcIl93aGlsZVwiLFxuICAgIGNfd2hpbGU6IFwiX2NvbnRpbnVlXCIsXG4gICAgbl93aGlsZTogXCJfbmV4dFwiLFxuICAgIG5fYXJnOiBcIl9faWNlZF9uZXh0X2FyZ1wiLFxuICAgIGRlZmVyX21ldGhvZDogXCJkZWZlclwiLFxuICAgIHNsb3Q6IFwiX19zbG90XCIsXG4gICAgYXNzaWduX2ZuOiBcImFzc2lnbl9mblwiLFxuICAgIGF1dG9jYjogXCJhdXRvY2JcIixcbiAgICByZXRzbG90OiBcInJldFwiLFxuICAgIHRyYWNlOiBcIl9faWNlZF90cmFjZVwiLFxuICAgIHBhc3NlZF9kZWZlcnJhbDogXCJfX2ljZWRfcGFzc2VkX2RlZmVycmFsXCIsXG4gICAgZmluZERlZmVycmFsOiBcImZpbmREZWZlcnJhbFwiLFxuICAgIGxpbmVubzogXCJsaW5lbm9cIixcbiAgICBwYXJlbnQ6IFwicGFyZW50XCIsXG4gICAgZmlsZW5hbWU6IFwiZmlsZW5hbWVcIixcbiAgICBmdW5jbmFtZTogXCJmdW5jbmFtZVwiLFxuICAgIGNhdGNoRXhjZXB0aW9uczogJ2NhdGNoRXhjZXB0aW9ucycsXG4gICAgcnVudGltZV9tb2RlczogW1wibm9kZVwiLCBcImlubGluZVwiLCBcIndpbmRvd1wiLCBcIm5vbmVcIiwgXCJicm93c2VyaWZ5XCIsIFwiaW50ZXJwXCJdLFxuICAgIHRyYW1wb2xpbmU6IFwidHJhbXBvbGluZVwiLFxuICAgIGNvbnRleHQ6IFwiY29udGV4dFwiLFxuICAgIGRlZmVyX2FyZzogXCJfX2ljZWRfZGVmZXJfXCJcbiAgfTtcblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBJY2VkQ29mZmVlU2NyaXB0IDEuNy4xLWJcbihmdW5jdGlvbigpIHtcbiAgdmFyIEMsIFBpcGVsaW5lciwgaWNlZCwgX19pY2VkX2ssIF9faWNlZF9rX25vb3AsIF9pYW5kLCBfaW9yLCBfdGltZW91dCxcbiAgICBfX3NsaWNlID0gW10uc2xpY2U7XG5cbiAgX19pY2VkX2sgPSBfX2ljZWRfa19ub29wID0gZnVuY3Rpb24oKSB7fTtcblxuICBDID0gcmVxdWlyZSgnLi9jb25zdCcpO1xuXG4gIGV4cG9ydHMuaWNlZCA9IGljZWQgPSByZXF1aXJlKCcuL3J1bnRpbWUnKTtcblxuICBfdGltZW91dCA9IGZ1bmN0aW9uKGNiLCB0LCByZXMsIHRtcCkge1xuICAgIHZhciBhcnIsIHJ2LCB3aGljaCwgX19faWNlZF9wYXNzZWRfZGVmZXJyYWwsIF9faWNlZF9kZWZlcnJhbHMsIF9faWNlZF9rO1xuICAgIF9faWNlZF9rID0gX19pY2VkX2tfbm9vcDtcbiAgICBfX19pY2VkX3Bhc3NlZF9kZWZlcnJhbCA9IGljZWQuZmluZERlZmVycmFsKGFyZ3VtZW50cyk7XG4gICAgcnYgPSBuZXcgaWNlZC5SZW5kZXp2b3VzO1xuICAgIHRtcFswXSA9IHJ2LmlkKHRydWUpLmRlZmVyKHtcbiAgICAgIGFzc2lnbl9mbjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyID0gX19zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKCksXG4gICAgICBsaW5lbm86IDIwLFxuICAgICAgY29udGV4dDogX19pY2VkX2RlZmVycmFsc1xuICAgIH0pO1xuICAgIHNldFRpbWVvdXQocnYuaWQoZmFsc2UpLmRlZmVyKHtcbiAgICAgIGxpbmVubzogMjEsXG4gICAgICBjb250ZXh0OiBfX2ljZWRfZGVmZXJyYWxzXG4gICAgfSksIHQpO1xuICAgIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIChmdW5jdGlvbihfX2ljZWRfaykge1xuICAgICAgICBfX2ljZWRfZGVmZXJyYWxzID0gbmV3IGljZWQuRGVmZXJyYWxzKF9faWNlZF9rLCB7XG4gICAgICAgICAgcGFyZW50OiBfX19pY2VkX3Bhc3NlZF9kZWZlcnJhbCxcbiAgICAgICAgICBmaWxlbmFtZTogXCIvVXNlcnMvbWF4L3NyYy9pY2VkL2ljZWQtcnVudGltZS9zcmMvbGlicmFyeS5pY2VkXCJcbiAgICAgICAgfSk7XG4gICAgICAgIHJ2LndhaXQoX19pY2VkX2RlZmVycmFscy5kZWZlcih7XG4gICAgICAgICAgYXNzaWduX2ZuOiAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiB3aGljaCA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkoKSxcbiAgICAgICAgICBsaW5lbm86IDIyXG4gICAgICAgIH0pKTtcbiAgICAgICAgX19pY2VkX2RlZmVycmFscy5fZnVsZmlsbCgpO1xuICAgICAgfSk7XG4gICAgfSkodGhpcykoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICByZXNbMF0gPSB3aGljaDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2IuYXBwbHkobnVsbCwgYXJyKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9O1xuXG4gIGV4cG9ydHMudGltZW91dCA9IGZ1bmN0aW9uKGNiLCB0LCByZXMpIHtcbiAgICB2YXIgdG1wO1xuICAgIHRtcCA9IFtdO1xuICAgIF90aW1lb3V0KGNiLCB0LCByZXMsIHRtcCk7XG4gICAgcmV0dXJuIHRtcFswXTtcbiAgfTtcblxuICBfaWFuZCA9IGZ1bmN0aW9uKGNiLCByZXMsIHRtcCkge1xuICAgIHZhciBvaywgX19faWNlZF9wYXNzZWRfZGVmZXJyYWwsIF9faWNlZF9kZWZlcnJhbHMsIF9faWNlZF9rO1xuICAgIF9faWNlZF9rID0gX19pY2VkX2tfbm9vcDtcbiAgICBfX19pY2VkX3Bhc3NlZF9kZWZlcnJhbCA9IGljZWQuZmluZERlZmVycmFsKGFyZ3VtZW50cyk7XG4gICAgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gKGZ1bmN0aW9uKF9faWNlZF9rKSB7XG4gICAgICAgIF9faWNlZF9kZWZlcnJhbHMgPSBuZXcgaWNlZC5EZWZlcnJhbHMoX19pY2VkX2ssIHtcbiAgICAgICAgICBwYXJlbnQ6IF9fX2ljZWRfcGFzc2VkX2RlZmVycmFsLFxuICAgICAgICAgIGZpbGVuYW1lOiBcIi9Vc2Vycy9tYXgvc3JjL2ljZWQvaWNlZC1ydW50aW1lL3NyYy9saWJyYXJ5LmljZWRcIlxuICAgICAgICB9KTtcbiAgICAgICAgdG1wWzBdID0gX19pY2VkX2RlZmVycmFscy5kZWZlcih7XG4gICAgICAgICAgYXNzaWduX2ZuOiAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvayA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkoKSxcbiAgICAgICAgICBsaW5lbm86IDM5XG4gICAgICAgIH0pO1xuICAgICAgICBfX2ljZWRfZGVmZXJyYWxzLl9mdWxmaWxsKCk7XG4gICAgICB9KTtcbiAgICB9KSh0aGlzKSgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgIHJlc1swXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYigpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH07XG5cbiAgZXhwb3J0cy5pYW5kID0gZnVuY3Rpb24oY2IsIHJlcykge1xuICAgIHZhciB0bXA7XG4gICAgdG1wID0gW107XG4gICAgX2lhbmQoY2IsIHJlcywgdG1wKTtcbiAgICByZXR1cm4gdG1wWzBdO1xuICB9O1xuXG4gIF9pb3IgPSBmdW5jdGlvbihjYiwgcmVzLCB0bXApIHtcbiAgICB2YXIgb2ssIF9fX2ljZWRfcGFzc2VkX2RlZmVycmFsLCBfX2ljZWRfZGVmZXJyYWxzLCBfX2ljZWRfaztcbiAgICBfX2ljZWRfayA9IF9faWNlZF9rX25vb3A7XG4gICAgX19faWNlZF9wYXNzZWRfZGVmZXJyYWwgPSBpY2VkLmZpbmREZWZlcnJhbChhcmd1bWVudHMpO1xuICAgIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIChmdW5jdGlvbihfX2ljZWRfaykge1xuICAgICAgICBfX2ljZWRfZGVmZXJyYWxzID0gbmV3IGljZWQuRGVmZXJyYWxzKF9faWNlZF9rLCB7XG4gICAgICAgICAgcGFyZW50OiBfX19pY2VkX3Bhc3NlZF9kZWZlcnJhbCxcbiAgICAgICAgICBmaWxlbmFtZTogXCIvVXNlcnMvbWF4L3NyYy9pY2VkL2ljZWQtcnVudGltZS9zcmMvbGlicmFyeS5pY2VkXCJcbiAgICAgICAgfSk7XG4gICAgICAgIHRtcFswXSA9IF9faWNlZF9kZWZlcnJhbHMuZGVmZXIoe1xuICAgICAgICAgIGFzc2lnbl9mbjogKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gb2sgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKCksXG4gICAgICAgICAgbGluZW5vOiA1OFxuICAgICAgICB9KTtcbiAgICAgICAgX19pY2VkX2RlZmVycmFscy5fZnVsZmlsbCgpO1xuICAgICAgfSk7XG4gICAgfSkodGhpcykoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvaykge1xuICAgICAgICAgIHJlc1swXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBleHBvcnRzLmlvciA9IGZ1bmN0aW9uKGNiLCByZXMpIHtcbiAgICB2YXIgdG1wO1xuICAgIHRtcCA9IFtdO1xuICAgIF9pb3IoY2IsIHJlcywgdG1wKTtcbiAgICByZXR1cm4gdG1wWzBdO1xuICB9O1xuXG4gIGV4cG9ydHMuUGlwZWxpbmVyID0gUGlwZWxpbmVyID0gKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIFBpcGVsaW5lcih3aW5kb3csIGRlbGF5KSB7XG4gICAgICB0aGlzLndpbmRvdyA9IHdpbmRvdyB8fCAxO1xuICAgICAgdGhpcy5kZWxheSA9IGRlbGF5IHx8IDA7XG4gICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICB0aGlzLm5fb3V0ID0gMDtcbiAgICAgIHRoaXMuY2IgPSBudWxsO1xuICAgICAgdGhpc1tDLmRlZmVycmFsc10gPSB0aGlzO1xuICAgICAgdGhpc1tcImRlZmVyXCJdID0gdGhpcy5fZGVmZXI7XG4gICAgfVxuXG4gICAgUGlwZWxpbmVyLnByb3RvdHlwZS53YWl0SW5RdWV1ZSA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgICB2YXIgX19faWNlZF9wYXNzZWRfZGVmZXJyYWwsIF9faWNlZF9kZWZlcnJhbHMsIF9faWNlZF9rO1xuICAgICAgX19pY2VkX2sgPSBfX2ljZWRfa19ub29wO1xuICAgICAgX19faWNlZF9wYXNzZWRfZGVmZXJyYWwgPSBpY2VkLmZpbmREZWZlcnJhbChhcmd1bWVudHMpO1xuICAgICAgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiAoZnVuY3Rpb24oX19pY2VkX2spIHtcbiAgICAgICAgICB2YXIgX3Jlc3VsdHMsIF93aGlsZTtcbiAgICAgICAgICBfcmVzdWx0cyA9IFtdO1xuICAgICAgICAgIF93aGlsZSA9IGZ1bmN0aW9uKF9faWNlZF9rKSB7XG4gICAgICAgICAgICB2YXIgX2JyZWFrLCBfY29udGludWUsIF9uZXh0O1xuICAgICAgICAgICAgX2JyZWFrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfX2ljZWRfayhfcmVzdWx0cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgX2NvbnRpbnVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpY2VkLnRyYW1wb2xpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF93aGlsZShfX2ljZWRfayk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIF9uZXh0ID0gZnVuY3Rpb24oX19pY2VkX25leHRfYXJnKSB7XG4gICAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goX19pY2VkX25leHRfYXJnKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF9jb250aW51ZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICghKF90aGlzLm5fb3V0ID49IF90aGlzLndpbmRvdykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9icmVhaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uKF9faWNlZF9rKSB7XG4gICAgICAgICAgICAgICAgX19pY2VkX2RlZmVycmFscyA9IG5ldyBpY2VkLkRlZmVycmFscyhfX2ljZWRfaywge1xuICAgICAgICAgICAgICAgICAgcGFyZW50OiBfX19pY2VkX3Bhc3NlZF9kZWZlcnJhbCxcbiAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBcIi9Vc2Vycy9tYXgvc3JjL2ljZWQvaWNlZC1ydW50aW1lL3NyYy9saWJyYXJ5LmljZWRcIixcbiAgICAgICAgICAgICAgICAgIGZ1bmNuYW1lOiBcIlBpcGVsaW5lci53YWl0SW5RdWV1ZVwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2IgPSBfX2ljZWRfZGVmZXJyYWxzLmRlZmVyKHtcbiAgICAgICAgICAgICAgICAgIGxpbmVubzogMTAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgX19pY2VkX2RlZmVycmFscy5fZnVsZmlsbCgpO1xuICAgICAgICAgICAgICB9KShfbmV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBfd2hpbGUoX19pY2VkX2spO1xuICAgICAgICB9KTtcbiAgICAgIH0pKHRoaXMpKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX3RoaXMubl9vdXQrKztcbiAgICAgICAgICAoZnVuY3Rpb24oX19pY2VkX2spIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5kZWxheSkge1xuICAgICAgICAgICAgICAoZnVuY3Rpb24oX19pY2VkX2spIHtcbiAgICAgICAgICAgICAgICBfX2ljZWRfZGVmZXJyYWxzID0gbmV3IGljZWQuRGVmZXJyYWxzKF9faWNlZF9rLCB7XG4gICAgICAgICAgICAgICAgICBwYXJlbnQ6IF9fX2ljZWRfcGFzc2VkX2RlZmVycmFsLFxuICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IFwiL1VzZXJzL21heC9zcmMvaWNlZC9pY2VkLXJ1bnRpbWUvc3JjL2xpYnJhcnkuaWNlZFwiLFxuICAgICAgICAgICAgICAgICAgZnVuY25hbWU6IFwiUGlwZWxpbmVyLndhaXRJblF1ZXVlXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KF9faWNlZF9kZWZlcnJhbHMuZGVmZXIoe1xuICAgICAgICAgICAgICAgICAgbGluZW5vOiAxMDhcbiAgICAgICAgICAgICAgICB9KSwgX3RoaXMuZGVsYXkpO1xuICAgICAgICAgICAgICAgIF9faWNlZF9kZWZlcnJhbHMuX2Z1bGZpbGwoKTtcbiAgICAgICAgICAgICAgfSkoX19pY2VkX2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIF9faWNlZF9rKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9O1xuXG4gICAgUGlwZWxpbmVyLnByb3RvdHlwZS5fX2RlZmVyID0gZnVuY3Rpb24ob3V0LCBkZWZlckFyZ3MpIHtcbiAgICAgIHZhciB0bXAsIHZvaWRDYiwgX19faWNlZF9wYXNzZWRfZGVmZXJyYWwsIF9faWNlZF9kZWZlcnJhbHMsIF9faWNlZF9rO1xuICAgICAgX19pY2VkX2sgPSBfX2ljZWRfa19ub29wO1xuICAgICAgX19faWNlZF9wYXNzZWRfZGVmZXJyYWwgPSBpY2VkLmZpbmREZWZlcnJhbChhcmd1bWVudHMpO1xuICAgICAgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiAoZnVuY3Rpb24oX19pY2VkX2spIHtcbiAgICAgICAgICBfX2ljZWRfZGVmZXJyYWxzID0gbmV3IGljZWQuRGVmZXJyYWxzKF9faWNlZF9rLCB7XG4gICAgICAgICAgICBwYXJlbnQ6IF9fX2ljZWRfcGFzc2VkX2RlZmVycmFsLFxuICAgICAgICAgICAgZmlsZW5hbWU6IFwiL1VzZXJzL21heC9zcmMvaWNlZC9pY2VkLXJ1bnRpbWUvc3JjL2xpYnJhcnkuaWNlZFwiLFxuICAgICAgICAgICAgZnVuY25hbWU6IFwiUGlwZWxpbmVyLl9fZGVmZXJcIlxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHZvaWRDYiA9IF9faWNlZF9kZWZlcnJhbHMuZGVmZXIoe1xuICAgICAgICAgICAgbGluZW5vOiAxMjJcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvdXRbMF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhcmdzLCBfcmVmO1xuICAgICAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgICAgICBpZiAoKF9yZWYgPSBkZWZlckFyZ3MuYXNzaWduX2ZuKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIF9yZWYuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdm9pZENiKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBfX2ljZWRfZGVmZXJyYWxzLl9mdWxmaWxsKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSkodGhpcykoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdGhpcy5uX291dC0tO1xuICAgICAgICAgIGlmIChfdGhpcy5jYikge1xuICAgICAgICAgICAgdG1wID0gX3RoaXMuY2I7XG4gICAgICAgICAgICBfdGhpcy5jYiA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gdG1wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cbiAgICBQaXBlbGluZXIucHJvdG90eXBlLl9kZWZlciA9IGZ1bmN0aW9uKGRlZmVyQXJncykge1xuICAgICAgdmFyIHRtcDtcbiAgICAgIHRtcCA9IFtdO1xuICAgICAgdGhpcy5fX2RlZmVyKHRtcCwgZGVmZXJBcmdzKTtcbiAgICAgIHJldHVybiB0bXBbMF07XG4gICAgfTtcblxuICAgIFBpcGVsaW5lci5wcm90b3R5cGUuZmx1c2ggPSBmdW5jdGlvbihhdXRvY2IpIHtcbiAgICAgIHZhciBfX19pY2VkX3Bhc3NlZF9kZWZlcnJhbCwgX19pY2VkX2ssIF9yZXN1bHRzLCBfd2hpbGU7XG4gICAgICBfX2ljZWRfayA9IGF1dG9jYjtcbiAgICAgIF9fX2ljZWRfcGFzc2VkX2RlZmVycmFsID0gaWNlZC5maW5kRGVmZXJyYWwoYXJndW1lbnRzKTtcbiAgICAgIF9yZXN1bHRzID0gW107XG4gICAgICBfd2hpbGUgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgdmFyIF9faWNlZF9kZWZlcnJhbHM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihfX2ljZWRfaykge1xuICAgICAgICAgIHZhciBfYnJlYWssIF9jb250aW51ZSwgX25leHQ7XG4gICAgICAgICAgX2JyZWFrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX19pY2VkX2soX3Jlc3VsdHMpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgX2NvbnRpbnVlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gaWNlZC50cmFtcG9saW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gX3doaWxlKF9faWNlZF9rKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgICAgX25leHQgPSBmdW5jdGlvbihfX2ljZWRfbmV4dF9hcmcpIHtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goX19pY2VkX25leHRfYXJnKTtcbiAgICAgICAgICAgIHJldHVybiBfY29udGludWUoKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmICghX3RoaXMubl9vdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBfYnJlYWsoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKGZ1bmN0aW9uKF9faWNlZF9rKSB7XG4gICAgICAgICAgICAgIF9faWNlZF9kZWZlcnJhbHMgPSBuZXcgaWNlZC5EZWZlcnJhbHMoX19pY2VkX2ssIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IF9fX2ljZWRfcGFzc2VkX2RlZmVycmFsLFxuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBcIi9Vc2Vycy9tYXgvc3JjL2ljZWQvaWNlZC1ydW50aW1lL3NyYy9saWJyYXJ5LmljZWRcIixcbiAgICAgICAgICAgICAgICBmdW5jbmFtZTogXCJQaXBlbGluZXIuZmx1c2hcIlxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgX3RoaXMuY2IgPSBfX2ljZWRfZGVmZXJyYWxzLmRlZmVyKHtcbiAgICAgICAgICAgICAgICBsaW5lbm86IDE1MVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgX19pY2VkX2RlZmVycmFscy5fZnVsZmlsbCgpO1xuICAgICAgICAgICAgfSkoX25leHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgX3doaWxlKF9faWNlZF9rKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFBpcGVsaW5lcjtcblxuICB9KSgpO1xuXG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IEljZWRDb2ZmZWVTY3JpcHQgMS43LjEtYlxuKGZ1bmN0aW9uKCkge1xuICB2YXIgaywgbW9kLCBtb2RzLCB2LCBfaSwgX2xlbjtcblxuICBleHBvcnRzW1wiY29uc3RcIl0gPSByZXF1aXJlKCcuL2NvbnN0Jyk7XG5cbiAgbW9kcyA9IFtyZXF1aXJlKCcuL3J1bnRpbWUnKSwgcmVxdWlyZSgnLi9saWJyYXJ5JyldO1xuXG4gIGZvciAoX2kgPSAwLCBfbGVuID0gbW9kcy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgIG1vZCA9IG1vZHNbX2ldO1xuICAgIGZvciAoayBpbiBtb2QpIHtcbiAgICAgIHYgPSBtb2Rba107XG4gICAgICBleHBvcnRzW2tdID0gdjtcbiAgICB9XG4gIH1cblxufSkuY2FsbCh0aGlzKTtcbiIsIi8vIEdlbmVyYXRlZCBieSBJY2VkQ29mZmVlU2NyaXB0IDEuNy4xLWJcbihmdW5jdGlvbigpIHtcbiAgdmFyIEMsIERlZmVycmFscywgUmVuZGV6dm91cywgZXhjZXB0aW9uSGFuZGxlciwgZmluZERlZmVycmFsLCBtYWtlX2RlZmVyX3JldHVybiwgc3RhY2tXYWxrLCB0aWNrX2NvdW50ZXIsIHRyYW1wb2xpbmUsIHdhcm4sIF9fYWN0aXZlX3RyYWNlLCBfX2MsIF90cmFjZV90b19zdHJpbmcsXG4gICAgX19zbGljZSA9IFtdLnNsaWNlO1xuXG4gIEMgPSByZXF1aXJlKCcuL2NvbnN0Jyk7XG5cbiAgbWFrZV9kZWZlcl9yZXR1cm4gPSBmdW5jdGlvbihvYmosIGRlZmVyX2FyZ3MsIGlkLCB0cmFjZV90ZW1wbGF0ZSwgbXVsdGkpIHtcbiAgICB2YXIgaywgcmV0LCB0cmFjZSwgdjtcbiAgICB0cmFjZSA9IHt9O1xuICAgIGZvciAoayBpbiB0cmFjZV90ZW1wbGF0ZSkge1xuICAgICAgdiA9IHRyYWNlX3RlbXBsYXRlW2tdO1xuICAgICAgdHJhY2Vba10gPSB2O1xuICAgIH1cbiAgICB0cmFjZVtDLmxpbmVub10gPSBkZWZlcl9hcmdzICE9IG51bGwgPyBkZWZlcl9hcmdzW0MubGluZW5vXSA6IHZvaWQgMDtcbiAgICByZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpbm5lcl9hcmdzLCBvLCBfcmVmO1xuICAgICAgaW5uZXJfYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IF9fc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICBpZiAoZGVmZXJfYXJncyAhPSBudWxsKSB7XG4gICAgICAgIGlmICgoX3JlZiA9IGRlZmVyX2FyZ3MuYXNzaWduX2ZuKSAhPSBudWxsKSB7XG4gICAgICAgICAgX3JlZi5hcHBseShudWxsLCBpbm5lcl9hcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG9iaikge1xuICAgICAgICBvID0gb2JqO1xuICAgICAgICBpZiAoIW11bHRpKSB7XG4gICAgICAgICAgb2JqID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gby5fZnVsZmlsbChpZCwgdHJhY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHdhcm4oXCJvdmVydXNlZCBkZWZlcnJhbCBhdCBcIiArIChfdHJhY2VfdG9fc3RyaW5nKHRyYWNlKSkpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0W0MudHJhY2VdID0gdHJhY2U7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBfX2MgPSAwO1xuXG4gIHRpY2tfY291bnRlciA9IGZ1bmN0aW9uKG1vZCkge1xuICAgIF9fYysrO1xuICAgIGlmICgoX19jICUgbW9kKSA9PT0gMCkge1xuICAgICAgX19jID0gMDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIF9fYWN0aXZlX3RyYWNlID0gbnVsbDtcblxuICBfdHJhY2VfdG9fc3RyaW5nID0gZnVuY3Rpb24odHIpIHtcbiAgICB2YXIgZm47XG4gICAgZm4gPSB0cltDLmZ1bmNuYW1lXSB8fCBcIjxhbm9ueW1vdXM+XCI7XG4gICAgcmV0dXJuIFwiXCIgKyBmbiArIFwiIChcIiArIHRyW0MuZmlsZW5hbWVdICsgXCI6XCIgKyAodHJbQy5saW5lbm9dICsgMSkgKyBcIilcIjtcbiAgfTtcblxuICB3YXJuID0gZnVuY3Rpb24obSkge1xuICAgIHJldHVybiB0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb25zb2xlICE9PSBudWxsID8gY29uc29sZS5lcnJvcihcIklDRUQgd2FybmluZzogXCIgKyBtKSA6IHZvaWQgMDtcbiAgfTtcblxuICBleHBvcnRzLnRyYW1wb2xpbmUgPSB0cmFtcG9saW5lID0gZnVuY3Rpb24oZm4pIHtcbiAgICBpZiAoIXRpY2tfY291bnRlcig1MDApKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBwcm9jZXNzLm5leHRUaWNrKGZuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZm4pO1xuICAgIH1cbiAgfTtcblxuICBleHBvcnRzLkRlZmVycmFscyA9IERlZmVycmFscyA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBEZWZlcnJhbHMoaywgdHJhY2UpIHtcbiAgICAgIHRoaXMudHJhY2UgPSB0cmFjZTtcbiAgICAgIHRoaXMuY29udGludWF0aW9uID0gaztcbiAgICAgIHRoaXMuY291bnQgPSAxO1xuICAgICAgdGhpcy5yZXQgPSBudWxsO1xuICAgIH1cblxuICAgIERlZmVycmFscy5wcm90b3R5cGUuX2NhbGwgPSBmdW5jdGlvbih0cmFjZSkge1xuICAgICAgdmFyIGM7XG4gICAgICBpZiAodGhpcy5jb250aW51YXRpb24pIHtcbiAgICAgICAgX19hY3RpdmVfdHJhY2UgPSB0cmFjZTtcbiAgICAgICAgYyA9IHRoaXMuY29udGludWF0aW9uO1xuICAgICAgICB0aGlzLmNvbnRpbnVhdGlvbiA9IG51bGw7XG4gICAgICAgIHJldHVybiBjKHRoaXMucmV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB3YXJuKFwiRW50ZXJlZCBkZWFkIGF3YWl0IGF0IFwiICsgKF90cmFjZV90b19zdHJpbmcodHJhY2UpKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERlZmVycmFscy5wcm90b3R5cGUuX2Z1bGZpbGwgPSBmdW5jdGlvbihpZCwgdHJhY2UpIHtcbiAgICAgIGlmICgtLXRoaXMuY291bnQgPiAwKSB7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cmFtcG9saW5lKCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX2NhbGwodHJhY2UpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIERlZmVycmFscy5wcm90b3R5cGUuZGVmZXIgPSBmdW5jdGlvbihhcmdzKSB7XG4gICAgICB2YXIgc2VsZjtcbiAgICAgIHRoaXMuY291bnQrKztcbiAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIG1ha2VfZGVmZXJfcmV0dXJuKHNlbGYsIGFyZ3MsIG51bGwsIHRoaXMudHJhY2UpO1xuICAgIH07XG5cbiAgICByZXR1cm4gRGVmZXJyYWxzO1xuXG4gIH0pKCk7XG5cbiAgZXhwb3J0cy5maW5kRGVmZXJyYWwgPSBmaW5kRGVmZXJyYWwgPSBmdW5jdGlvbihhcmdzKSB7XG4gICAgdmFyIGEsIF9pLCBfbGVuO1xuICAgIGZvciAoX2kgPSAwLCBfbGVuID0gYXJncy5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgYSA9IGFyZ3NbX2ldO1xuICAgICAgaWYgKGEgIT0gbnVsbCA/IGFbQy50cmFjZV0gOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGV4cG9ydHMuUmVuZGV6dm91cyA9IFJlbmRlenZvdXMgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIFJ2SWQ7XG5cbiAgICBmdW5jdGlvbiBSZW5kZXp2b3VzKCkge1xuICAgICAgdGhpcy5jb21wbGV0ZWQgPSBbXTtcbiAgICAgIHRoaXMud2FpdGVycyA9IFtdO1xuICAgICAgdGhpcy5kZWZlcl9pZCA9IDA7XG4gICAgfVxuXG4gICAgUnZJZCA9IChmdW5jdGlvbigpIHtcbiAgICAgIGZ1bmN0aW9uIFJ2SWQocnYsIGlkLCBtdWx0aSkge1xuICAgICAgICB0aGlzLnJ2ID0gcnY7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5tdWx0aSA9IG11bHRpO1xuICAgICAgfVxuXG4gICAgICBSdklkLnByb3RvdHlwZS5kZWZlciA9IGZ1bmN0aW9uKGRlZmVyX2FyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnYuX2RlZmVyX3dpdGhfaWQodGhpcy5pZCwgZGVmZXJfYXJncywgdGhpcy5tdWx0aSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gUnZJZDtcblxuICAgIH0pKCk7XG5cbiAgICBSZW5kZXp2b3VzLnByb3RvdHlwZS53YWl0ID0gZnVuY3Rpb24oY2IpIHtcbiAgICAgIHZhciB4O1xuICAgICAgaWYgKHRoaXMuY29tcGxldGVkLmxlbmd0aCkge1xuICAgICAgICB4ID0gdGhpcy5jb21wbGV0ZWQuc2hpZnQoKTtcbiAgICAgICAgcmV0dXJuIGNiKHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FpdGVycy5wdXNoKGNiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgUmVuZGV6dm91cy5wcm90b3R5cGUuZGVmZXIgPSBmdW5jdGlvbihkZWZlcl9hcmdzKSB7XG4gICAgICB2YXIgaWQ7XG4gICAgICBpZCA9IHRoaXMuZGVmZXJfaWQrKztcbiAgICAgIHJldHVybiB0aGlzLl9kZWZlcl93aXRoX2lkKGlkLCBkZWZlcl9hcmdzKTtcbiAgICB9O1xuXG4gICAgUmVuZGV6dm91cy5wcm90b3R5cGUuaWQgPSBmdW5jdGlvbihpLCBtdWx0aSkge1xuICAgICAgbXVsdGkgPSAhIW11bHRpO1xuICAgICAgcmV0dXJuIG5ldyBSdklkKHRoaXMsIGksIG11bHRpKTtcbiAgICB9O1xuXG4gICAgUmVuZGV6dm91cy5wcm90b3R5cGUuX2Z1bGZpbGwgPSBmdW5jdGlvbihpZCwgdHJhY2UpIHtcbiAgICAgIHZhciBjYjtcbiAgICAgIGlmICh0aGlzLndhaXRlcnMubGVuZ3RoKSB7XG4gICAgICAgIGNiID0gdGhpcy53YWl0ZXJzLnNoaWZ0KCk7XG4gICAgICAgIHJldHVybiBjYihpZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZWQucHVzaChpZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIFJlbmRlenZvdXMucHJvdG90eXBlLl9kZWZlcl93aXRoX2lkID0gZnVuY3Rpb24oaWQsIGRlZmVyX2FyZ3MsIG11bHRpKSB7XG4gICAgICB0aGlzLmNvdW50Kys7XG4gICAgICByZXR1cm4gbWFrZV9kZWZlcl9yZXR1cm4odGhpcywgZGVmZXJfYXJncywgaWQsIHt9LCBtdWx0aSk7XG4gICAgfTtcblxuICAgIHJldHVybiBSZW5kZXp2b3VzO1xuXG4gIH0pKCk7XG5cbiAgZXhwb3J0cy5zdGFja1dhbGsgPSBzdGFja1dhbGsgPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBsaW5lLCByZXQsIHRyLCBfcmVmO1xuICAgIHJldCA9IFtdO1xuICAgIHRyID0gY2IgPyBjYltDLnRyYWNlXSA6IF9fYWN0aXZlX3RyYWNlO1xuICAgIHdoaWxlICh0cikge1xuICAgICAgbGluZSA9IFwiICAgYXQgXCIgKyAoX3RyYWNlX3RvX3N0cmluZyh0cikpO1xuICAgICAgcmV0LnB1c2gobGluZSk7XG4gICAgICB0ciA9IHRyICE9IG51bGwgPyAoX3JlZiA9IHRyW0MucGFyZW50XSkgIT0gbnVsbCA/IF9yZWZbQy50cmFjZV0gOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgZXhwb3J0cy5leGNlcHRpb25IYW5kbGVyID0gZXhjZXB0aW9uSGFuZGxlciA9IGZ1bmN0aW9uKGVyciwgbG9nZ2VyKSB7XG4gICAgdmFyIHN0YWNrO1xuICAgIGlmICghbG9nZ2VyKSB7XG4gICAgICBsb2dnZXIgPSBjb25zb2xlLmVycm9yO1xuICAgIH1cbiAgICBsb2dnZXIoZXJyLnN0YWNrKTtcbiAgICBzdGFjayA9IHN0YWNrV2FsaygpO1xuICAgIGlmIChzdGFjay5sZW5ndGgpIHtcbiAgICAgIGxvZ2dlcihcIkljZWQgJ3N0YWNrJyB0cmFjZSAody8gcmVhbCBsaW5lIG51bWJlcnMpOlwiKTtcbiAgICAgIHJldHVybiBsb2dnZXIoc3RhY2suam9pbihcIlxcblwiKSk7XG4gICAgfVxuICB9O1xuXG4gIGV4cG9ydHMuY2F0Y2hFeGNlcHRpb25zID0gZnVuY3Rpb24obG9nZ2VyKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3MgIT09IG51bGwgPyBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIGZ1bmN0aW9uKGVycikge1xuICAgICAgZXhjZXB0aW9uSGFuZGxlcihlcnIsIGxvZ2dlcik7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5leGl0KDEpO1xuICAgIH0pIDogdm9pZCAwO1xuICB9O1xuXG59KS5jYWxsKHRoaXMpO1xuIl19
