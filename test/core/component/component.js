describe("Component", function() {
  var componentConstructor = Moon.extend("const", {template: "<div>Hello Moon!</div>"});

  it("should create a constructor", function() {
    expect(new componentConstructor({})).to.be.an.instanceof(Moon);
  });

  it("should create a constructor that can mount to an element", function() {
    var root = createTestElement("componentConstructorMount", "");
    new componentConstructor({
      root: root
    });

    return wait(function() {
      expect(root.firstChild.textContent).to.equal("Hello Moon!");
    });
  });

  it("should create a constructor that can mount to an element manually", function() {
    var root = createTestElement("componentConstructorMountManual", "");
    var instance = new componentConstructor({});
    instance.mount(root);

    return wait(function() {
      expect(root.firstChild.textContent).to.equal("Hello Moon!");
    });
  });

  it("should render HTML", function() {
    var component = createTestElement("component", "<component></component>");

    Moon.extend("component", {
      template: "<h1>Hello Moon!</h1>"
    });

    new Moon({
      root: "#component"
    });

    return wait(function() {
      expect(component.firstChild.innerHTML).to.equal("Hello Moon!");
    });
  });

  it("should error when data is not a function", function() {
    var fail = false;
    console.error = function() {
      fail = true;
      console.error = noop;
    }

    Moon.extend("data-function-fail", {
      template: "<h1>Hello Moon!</h1>",
      data: {}
    });

    return wait(function() {
      expect(fail).to.be["true"];
    });
  });

  describe("Mounting", function() {
    it("should mount when replaced", function() {
      var mountComponentReplace = createTestElement("mountComponentReplace", "<h1>Test</h1><component m-if='condition'></component>");
      var h1 = mountComponentReplace.firstChild;
      var app = new Moon({
        root: "#mountComponentReplace",
        data: {
          condition: false
        }
      });

      app.set("condition", true);
      return wait(function() {
        expect(h1.nextSibling.nodeName.toLowerCase()).to.equal("h1");
        expect(h1.nextSibling.textContent).to.equal("Hello Moon!");
      });
    });

    it("should mount when appended", function() {
      var mountComponentAppend = createTestElement("mountComponentAppend", "<h1>Test</h1><div m-if='condition'><component></component></div>");
      var h1 = mountComponentAppend.firstChild;
      var app = new Moon({
        root: "#mountComponentAppend",
        data: {
          condition: false
        }
      });

      app.set("condition", true);
      return wait(function() {
        expect(h1.nextSibling.firstChild.nodeName.toLowerCase()).to.equal("h1");
        expect(h1.nextSibling.firstChild.textContent).to.equal("Hello Moon!");
      });
    });
  });

  describe("Destroy", function() {
    it("should destroy when being replaced", function() {
      var destroyComponentReplace = createTestElement("destroyComponentReplace", "<component-destroy-replace m-if='condition'></component-destroy-replace>");
      var destroyed = false;

      Moon.extend("component-destroy-replace", {
        template: "<h1>Hello Moon!</h1>",
        hooks: {
          destroyed: function() {
            destroyed = true;
          }
        }
      });

      var app = new Moon({
        root: "#destroyComponentReplace",
        data: {
          condition: true
        }
      });

      app.set("condition", false);
      return wait(function() {
        expect(destroyComponentReplace.firstChild.nodeName.toLowerCase()).to.equal("#text");
        expect(destroyed).to.be["true"];
      });
    });

    it("should destroy when being removed", function() {
      var destroyComponentRemove = createTestElement("destroyComponentRemove", "<component-destroy-remove m-for='number in range'></component-destroy-remove>");
      var destroyed = false;

      Moon.extend("component-destroy-remove", {
        template: "<h1>Hello Moon!</h1>",
        hooks: {
          destroyed: function() {
            destroyed = true;
          }
        }
      });

      var app = new Moon({
        root: "#destroyComponentRemove",
        data: {
          range: 1
        }
      });

      app.set("range", 0);
      return wait(function() {
        expect(destroyComponentRemove.firstChild).to.be["null"];
        expect(destroyed).to.be["true"];
      });
    });
  });

  describe("Data", function() {
    var componentData = createTestElement("componentData", "<component-data></component-data>");
    var h1 = null;
    var button = null;

    Moon.extend("component-data", {
      template: "<div><h1>{{msg}}</h1><button m-on:click='change'></button></div>",
      data: function() {
        return {
          msg: "Hello Moon!"
        }
      },
      methods: {
        change: function() {
          this.set("msg", "Changed");
        }
      }
    });

    new Moon({
      root: "#componentData"
    });

    it("should render data from within the component state", function() {
      return wait(function() {
        h1 = componentData.firstChild.firstChild;
        button = h1.nextSibling;
        expect(h1.innerHTML).to.equal("Hello Moon!");
      });
    });

    it("should update when data is updated", function() {
      button.click();
      return wait(function() {
        expect(h1.innerHTML).to.equal("Changed");
      });
    });
  });

  describe("Props", function() {
    var componentProps = createTestElement("componentProps", "<component-props msg='{{msg}}'></component-props>");

    Moon.extend("component-props", {
      template: "<h1>{{msg}}</h1>",
      props: ["msg"]
    });

    var app = new Moon({
      root: "#componentProps",
      data: {
        msg: "Hello Moon!"
      }
    });

    it("should render with props", function() {
      return wait(function() {
        expect(componentProps.firstChild.innerHTML).to.equal("Hello Moon!");
      });
    });

    it("should render when updated", function() {
      app.set("msg", "Changed");
      return wait(function() {
        expect(componentProps.firstChild.innerHTML).to.equal("Changed");
      });
    });
  });

  describe("Insertion", function() {
    it("should render the default insertion", function() {
      var defaultInsertion = createTestElement("componentDefaultInsertion", "<component-default-insertion>Hello Moon!</component-default-insertion>");

      Moon.extend("component-default-insertion", {
        template: "<h1><m-insert></m-insert></h1>"
      });

      new Moon({
        root: "#componentDefaultInsertion"
      });

      return wait(function() {
        expect(defaultInsertion.firstChild.nodeName.toLowerCase()).to.equal("h1");
        expect(defaultInsertion.firstChild.innerHTML).to.equal("Hello Moon!");
      });
    });

    it("should update the default insertion", function() {

    });

    // it("should render a named slot", function() {
    //   var namedSlot = createTestElement("componentNamedSlot", "<component-named-slot><span slot='named'>Hello Moon!</span></component-named-slot>");
    //
    //   Moon.extend("component-named-slot", {
    //     template: "<h1><slot name='named'></slot></h1>"
    //   });
    //
    //   new Moon({
    //     root: "#componentNamedSlot"
    //   });
    //
    //   return wait(function() {
    //     var h1 = namedSlot.firstChild;
    //     var span = h1.firstChild;
    //     expect(h1.nodeName.toLowerCase()).to.equal("h1");
    //     expect(span.nodeName.toLowerCase()).to.equal("span");
    //     expect(span.innerHTML).to.equal("Hello Moon!");
    //   });
    // });
  });

  describe("Events from Children", function() {
    it("should listen to events from child components", function() {
      var childEvent = createTestElement("childEvent", "<p>{{total}}</p><counter m-on:increment='incrementTotal'></counter>");
      var p = childEvent.firstChild;
      var h1 = null;
      var button = null;

      var counter = Moon.extend("counter", {
        template: "<div><h1>{{count}}</h1><button m-on:click='increment'>Increment</button></div>",
        data: function() {
          return {
            count: 0
          }
        },
        methods: {
          increment: function() {
            this.set("count", this.get("count") + 1);
            this.emit("increment");
          }
        }
      });

      new Moon({
        root: "#childEvent",
        data: {
          total: 0
        },
        methods: {
          incrementTotal: function() {
            this.set("total", this.get("total") + 1);
          }
        }
      });

      return wait(function(done) {
        h1 = p.nextSibling.firstChild;
        button = h1.nextSibling;

        button.click();

        Moon.nextTick(function() {
          expect(p.innerHTML).to.equal("1");
          expect(h1.innerHTML).to.equal("1");

          done();
        });
      });
    });
  });

  describe("Events from Children With Existing Events", function() {
    it("should listen to events from child components with existing events", function() {
      var childEventExisting = createTestElement("childEventExisting", "<p>{{total}}</p><counter-existing m-on:increment='incrementTotal'></counter-existing>");
      var p = childEventExisting.firstChild;
      var h1 = null;
      var button = null;
      var eventCalled = false;

      var counter = Moon.extend("counter-existing", {
        template: "<div><h1>{{count}}</h1><button m-on:click='increment'>Increment</button></div>",
        data: function() {
          return {
            count: 0
          }
        },
        methods: {
          increment: function() {
            this.set("count", this.get("count") + 1);
            this.emit("increment");
          }
        },
        hooks: {
          init: function() {
            this.on("increment", function() {
              eventCalled = true;
            });
          }
        }
      });

      new Moon({
        root: "#childEventExisting",
        data: {
          total: 0
        },
        methods: {
          incrementTotal: function() {
            this.set("total", this.get("total") + 1);
          }
        }
      });

      return wait(function(done) {
        h1 = p.nextSibling.firstChild;
        button = h1.nextSibling;

        button.click();

        Moon.nextTick(function() {
          expect(eventCalled).to.be['true'];
          expect(p.innerHTML).to.equal("1");
          expect(h1.innerHTML).to.equal("1");

          done();
        });
      });
    });
  });
});
