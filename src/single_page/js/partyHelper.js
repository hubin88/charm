function setStyle(obj, json) {
  for (var i in json) {
    obj.style[i] = json[i];
  }
};
function getStyle(obj, name) {
  if (obj.currentStyle) {
    return obj.currentStyle[name];//IE下获取非行间样式
  } else {
    return getComputedStyle(obj, false)[name];//FF、Chorme下获取非行间样式
  }
};
function PartyList() {
  this.titleBox = document.getElementsByClassName("partyList__title___1OTfs");
  this.dotBox = document.getElementsByClassName("partyList__dot___1NbZ7");
  this.arrowBox = document.getElementsByClassName("partyList__arrow___1w3um");
  this.contentBox = document.getElementsByClassName("partyList__content___2m1eD");
  this.init();
  for (var i = 0, len = this.titleBox.length; i < len; i++) {
    this.titleBox[i].onclick = function (e) {
      var sbiling = e.currentTarget.parentNode.children[1];
      var icon = e.currentTarget.children[2];
      if (getStyle(sbiling, 'display') === "none") {
        setStyle(sbiling, {
          display: 'block',
        });
        setStyle(icon, {
          backgroundImage: 'url("../images/arrow-up.png")'
        });
      } else {
        setStyle(sbiling, {
          display: 'none',
        });
        setStyle(icon, {
          backgroundImage: 'url("../images/arrow-down.png")'
        });
      }
    }
  }
}
PartyList.prototype.init = function () {
  var width = this.titleBox[0].getBoundingClientRect().width - this.dotBox[0].getBoundingClientRect().width - this.arrowBox[0].getBoundingClientRect().width;
  for (var i = 0, len = this.contentBox.length; i < len; i++) {
    this.contentBox[i].setAttribute('style', 'width:' + width + 'px');
  }
}
window.partyList = new PartyList();