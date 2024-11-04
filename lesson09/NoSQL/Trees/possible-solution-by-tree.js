class TreeNode {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
  addChild(childName) {
    const childNode = new TreeNode(childName);
    this.children.push(childNode);
    return childNode;
  }
  print(indent = "") {
    console.log(indent + this.name);
    this.children.forEach((child) => child.print(indent + "  "));
  }
}

const root = new TreeNode("/");

const bin = root.addChild("bin");
const dev = root.addChild("dev");
const etc = root.addChild("etc");
const home = root.addChild("home");

const passwd = etc.addChild("passwd");
const mthomas = home.addChild("mthomas");
const stu1 = home.addChild("stu1");

const binMthomas = mthomas.addChild("bin");
const classStuff = mthomas.addChild("class_stuff");
mthomas.addChild(".profile");

classStuff.addChild("foo");
classStuff.addChild("bar");
root.print();
