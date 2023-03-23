/*
 * 추상 팩토리 인터페이스는 팩토리 클래스에 필요한 메서드들을 선언한다.
 * 해당 메서드들은 product를 생성하는 메서드로, 해당 메서드끼리는 family로 간주한다.
 * 그래서 한 family의 product끼리는 서로간의 collaboration이 가능하다.
 */
interface AbstractFactory {
  createProductA(): AbstractProductA;

  createProductB(): AbstractProductB;
}

/*
 * 추상 팩토리를 implementation한 구체화된 팩토리는 실제로 한 family의 product들을 생성하는 메서드를 구현한다.
 * 각 메서드들은 실제 product 인스턴스를 반환한다.
 */
class ConcreteFactory1 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA1();
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB1();
  }
}

class ConcreteFactory2 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA2();
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB2();
  }
}

/**
 * 각 product들은 먼저 인터페이스가 존재하고, product를 implementation하는 실제 product 클래스가 존재한다.
 */
interface AbstractProductA {
  usefulFunctionA(): string;
}

class ConcreteProductA1 implements AbstractProductA {
  public usefulFunctionA(): string {
    return "The result of the product A1.";
  }
}

class ConcreteProductA2 implements AbstractProductA {
  public usefulFunctionA(): string {
    return "The result of the product A2.";
  }
}

interface AbstractProductB {
  usefulFunctionB(): string;
  anotherUsefulFunctionB(collaborator: AbstractProductA): string; // Product A와 상호작용하는 메서드
}

class ConcreteProductB1 implements AbstractProductB {
  public usefulFunctionB(): string {
    return "The result of the product B1.";
  }

  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
    const result = collaborator.usefulFunctionA();
    return `The result of the B1 collaborating with the (${result})`;
  }
}

class ConcreteProductB2 implements AbstractProductB {
  public usefulFunctionB(): string {
    return "The result of the product B2.";
  }

  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
    const result = collaborator.usefulFunctionA();
    return `The result of the B2 collaborating with the (${result})`;
  }
}

/**
 * clientCode는 factory 인스턴스를 받아서 해당 인스턴스의 메소드를 사용한다.
 */

function clientCode(factory: AbstractFactory) {
  const productA = factory.createProductA();
  const productB = factory.createProductB();

  console.log(productB.usefulFunctionB());
  console.log(productB.anotherUsefulFunctionB(productA));
}

console.log("Client: Testing client code with the first factory type...");
clientCode(new ConcreteFactory1());

console.log("");

console.log(
  "Client: Testing the same client code with the second factory type..."
);
clientCode(new ConcreteFactory2());

/** console log
 * Client: Testing client code with the first factory type...
 * The result of the product B1.
 * The result of the B1 collaborating with the (The result of the product A1.)
 *
 * Client: Testing the same client code with the second factory type...
 * The result of the product B2.
 * The result of the B2 collaborating with the (The result of the product A2.)
 */
