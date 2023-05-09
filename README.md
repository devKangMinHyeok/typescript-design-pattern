# Design Pattern with Typescript

## List

### Creational Pattern(생성 패턴)

[Creational Pattern(생성 패턴) - Factory Method (팩토리 메서드)](#creational-pattern생성-패턴---factory-method-팩토리-메서드)

[Creational Pattern(생성 패턴) - Abstract Factory (추상 팩토리)](#creational-pattern생성-패턴---abstract-factory-추상-팩토리)

[Creational Pattern(생성 패턴) - Builder (빌더)](#creational-pattern생성-패턴---builder-빌더)

[Creational Pattern(생성 패턴) - Prototype (프로토타입)](#creational-pattern생성-패턴---prototype-프로토타입)

[Creational Pattern(생성 패턴) - Singleton (싱글톤)](#creational-pattern생성-패턴---singleton-싱글톤)

### Structural Pattern(구조 패턴)

[Structural Pattern(구조 패턴) - Adapter (어댑터)](#structural-pattern구조-패턴---adapter-어댑터)

[Structural Pattern(구조 패턴) - Bridge (브릿지)](#structural-pattern구조-패턴---bridge-브릿지)

[Structural Pattern(구조 패턴) - Composite (복합체)](#structural-pattern구조-패턴---composite-복합체)

## Creational Pattern(생성 패턴) - Factory Method (팩토리 메서드)

### Keyword

`subclass`, `overriding`, `interface`, `생성`, `객체 생성의 책임`, `의존성 제거`

---

### Script

Factory method 패턴은 하위 클래스에서 Factory method를 overriding하여 객체를 반환하게 하는 디자인 패턴입니다. 객체를 생성하기 위해 interface를 정의하지만, 어떤 class의 instance를 생성할지에 대한 결정은 subclass가 내리도록 합니다.

Factory method 패턴은 주로,

1. 어떤 class가 자신이 생성해야 하는 객체의 class를 예측할 수 없을 때
2. 생성할 객체를 기술하는 책임을 자신의 subclass가 지정하길 원할 때
3. 객체 생성의 책임을 subclass에게 위임하고, subclass에 대한 정보를 은닉시키고 싶을 때
   사용합니다.

Factory method를 사용하면, 새로운 instance를 다른 방법으로 생성하는 것을 기존 코드의 수정 없이 확장할 수 있습니다. 확장에 열려 있고, 변경에 닫혀있는 객체지향의 원칙을 적용했다고 볼 수 있습니다. 이말은 쉽게 이야기하면, product 생성 코드와 product를 실제로 사용하는 코드를 분리한다는 뜻입니다. 그럼 product의 생성 코드를 다른 코드와는 독립적으로 확장하기 쉬워집니다.

결국 class 간의 결합도가 낮아져, 변경 사항에 유연하게 대처할 수 있고, subclass에 객체 생성을 위임함으로써 의존성을 제거할 수 있습니다.

물론 class가 많아지고 class의 계층도 커질 수 있고, client는 반드시 creator class를 상속하여 product를 생성해야한다는 단점이 존재합니다.

---

### Additional

#### 코드 예제 (typescript)

**전체 코드**

```ts
abstract class Creator {
  public abstract factoryMethod(): Product;

  public someOperation(): string {
    const product = this.factoryMethod();
    return `Creator: The same creator's code has just worked with ${product.operation()}`;
  }
}

class ConcreteCreator1 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct1();
  }
}

class ConcreteCreator2 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct2();
  }
}

interface Product {
  operation(): string;
}

class ConcreteProduct1 implements Product {
  public operation(): string {
    return "{Result of the ConcreteProduct1}";
  }
}

class ConcreteProduct2 implements Product {
  public operation(): string {
    return "{Result of the ConcreteProduct2}";
  }
}

function clientCode(creator: Creator) {
  console.log(
    "Client: I'm not aware of the creator's class, but it still works."
  );
  console.log(creator.someOperation());
}

console.log("App: Launched with the ConcreteCreator1.");
clientCode(new ConcreteCreator1());
console.log("");

console.log("App: Launched with the ConcreteCreator2.");
clientCode(new ConcreteCreator2());

/* console.log
 * App: Launched with the ConcreteCreator1.
 * Client: I'm not aware of the creator's class, but it still works.
 * Creator: The same creator's code has just worked with {Result of the ConcreteProduct1}
 *
 * App: Launched with the ConcreteCreator2.
 * Client: I'm not aware of the creator's class, but it still works.
 * Creator: The same creator's code has just worked with {Result of the ConcreteProduct2}
 */
```

**코드 분석**

먼저 Creator라는 추상 클래스를 정의한다.

```ts
abstract class Creator {
  public abstract factoryMethod(): Product;
  public someOperation(): string {
    const product = this.factoryMethod();
    return `Creator: The same creator's code has just worked with ${product.operation()}`;
  }
}
```

그리고 Creator 클래스를 상속받은 ConcreteCreator1, ConcreteCreator2를 정의한다.
각각의 생성 클래스는 Creator 클래스의 추상 메서드인 factoryMethod를 구현한다.
해당 factoryMethod는 ConcreteProduct1 또는 ConcreteProduct2의 instance를 생성하여 반환한다.

```ts
class ConcreteCreator1 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct1();
  }
}

class ConcreteCreator2 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct2();
  }
}
```

그리고 Product라는 인터페이스를 정의한다.
이 interface를 implement하는 클래스는 operation 메서드가 구현되어야 한다.

```ts
interface Product {
  operation(): string;
}
```

이후 Product interface를 구현하는 ConcreteProduct1, ConcreteProduct2 클래스를 정의한다.
그리고 여기에서 operation 메서드를 구현한다.

```ts
class ConcreteProduct1 implements Product {
  public operation(): string {
    return "{Result of the ConcreteProduct1}";
  }
}

class ConcreteProduct2 implements Product {
  public operation(): string {
    return "{Result of the ConcreteProduct2}";
  }
}
```

clientCode 함수는 Creator instance를 받아서 someOperation 메서드를 실행시킨다.

```ts
function clientCode(creator: Creator) {
  console.log(
    "Client: I'm not aware of the creator's class, but it still works."
  );
  console.log(creator.someOperation());
}
```

Creator class를 다시보면, someOperation이 구현이 되어있다.
factoryMethod는 추상 메서드였지만, someOperation은 이미 구현이 되어있다.

this 키워드를 사용해서, someOperation을 호출한 class의 factoryMethod를 실행시킨다.
그럼 아까 clientCode에서 인자로 받은 creator instance가 this가 되고, 해당 instance의 factoryMethod 메서드가 실행된다.

```ts
abstract class Creator {
  public abstract factoryMethod(): Product;
  public someOperation(): string {
    const product = this.factoryMethod();
    return `Creator: The same creator's code has just worked with ${product.operation()}`;
  }
}
```

아까 봤듯이 factoryMethod는 추상 메서드로, Creator를 상속받는 sub 클래스에서 이를 구현한다.
즉, clientCode에 ConcreteCreator1이나 ConcreteCreator2와 같은 Creator type의 instance를 넘기면, 해당 instance의 factoryMethod 메서드가 clientCode에서 실행되는 것이다.

```ts
class ConcreteCreator1 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct1();
  }
}

class ConcreteCreator2 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct2();
  }
}
```

이로써 생성된 Creator의 someOperation 메서드의 product가 operation 메서드를 호출하면, ConcreteProduct1 또는 ConcreteProduct2에서 구현된 operation 메서드가 실행되는 것이다.

clientCode에 서로 다른 생성 subclass를 넘겨 실행하는 코드와 결과는 다음과 같다.

```ts
console.log("App: Launched with the ConcreteCreator1.");
clientCode(new ConcreteCreator1());
console.log("");

console.log("App: Launched with the ConcreteCreator2.");
clientCode(new ConcreteCreator2());
```

**console**

```ts
App: Launched with the ConcreteCreator1.
Client: I'm not aware of the creator's class, but it still works.
Creator: The same creator's code has just worked with {Result of the ConcreteProduct1}

App: Launched with the ConcreteCreator2.
Client: I'm not aware of the creator's class, but it still works.
Creator: The same creator's code has just worked with {Result of the ConcreteProduct2}
```

정리하자면,

1. Creator 라는 추상 클래스를 만든다.
2. 이 추상 클래스는 직접적으로 instance를 만들지 않는다. 오로지 이 추상 클래스를 상속받은 sub 클래스가 생성의 책임을 갖는다.
3. 해당 sub class들은 Creator 추상 클래스를 구현하고, client는 이 sub 클래스에 의해 생성된 instance를 전달받는다.

결국 sub class에서만 instance 생성을 가능하게함으로써, 언제든 Creator 클래스를 확장해서 새로운 sub 클래스를 만들어 instance를 생성할 수 있고, clientCode에서는 늘 Creator 클래스를 인자로 받기 때문에 client에서는 코드 수정이 필요가 없다.

그리고 clientCode에서는 자신이 어떤 생성 클래스를 받았는지는 모른다. 이를 통해 은닉화를 수행할 수 있고, 결과적으로 class 간의 결합도가 낮아져 변경사항에 유연하게 대처할 수 있다.

쉽게 다시 풀어서 설명하자면, 결국 'product를 사용'하는 clientCode라는 함수와 'product를 생성'하는 ConcreteCreator가 분리되어 있고, ConcreteCreator는 쉽게 독립적으로 만들 수 있다. (단일 책임 원칙)

clientCode는 어떤 ConcreteCreator가 들어오는지는 관심없고, 어떤 ConcreteCreator가 들어오더라도 작동할 수 있다. 이렇게되면, 각 Creator간의 결합도가 낮아서 확장에 굉장히 유연하고, client 코드는 변경없이 동작 가능해진다. (개방/폐쇄 원칙)

---

### Reference

[팩토리 메서드 패턴](https://refactoring.guru/ko/design-patterns/factory-method)

[[번역] 자바스크립트 디자인 패턴](https://www.devh.kr/2021/Design-Patterns-In-JavaScript/)

[팩토리 메서드](https://velog.io/@ljo_0920/%ED%8C%A9%ED%86%A0%EB%A6%AC-%EB%A9%94%EC%84%9C%EB%93%9C)

[팩토리 메소드 패턴(Factory Method Pattern)](https://dev-youngjun.tistory.com/195)

[Typescript - (디자인 패턴) 추상화 팩토리 vs 팩토리 메서드
](https://velog.io/@from_numpy/Typescript-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-%EC%B6%94%EC%83%81%ED%99%94-%ED%8C%A9%ED%86%A0%EB%A6%AC-vs-%ED%8C%A9%ED%86%A0%EB%A6%AC-%EB%A9%94%EC%84%9C%EB%93%9C)

[typescript guidebook - 추상 클래스](https://yamoo9.gitbook.io/typescript/classes/abstract-class)

[extends와 implements](https://www.howdy-mj.me/typescript/extends-and-implements)

## Creational Pattern(생성 패턴) - Abstract Factory (추상 팩토리)

### Keyword

`생성 패턴`, `팩토리 클래스`, `서브 클래스`, `client 코드`, `개방/폐쇄 원칙`, `기능 확장`

---

### Script

추상 팩토리는 생성 패턴 중의 하나로, 서로 연관된 객체들을 묶어 팩토리 클래스로 만들고, 팩토리 메서드와 마찬가지로 서브 클래스에 인스턴스 생성을 위임하는 디자인 패턴입니다.

추상 팩토리 방식으로 설계하면, 관련성 있는 여러 종류의 객체를 일관된 방식으로 생성할 수 있습니다. 그리고 client 코드에는 자신이 어떤 클래스의 인스턴스를 생성하는지에 상관없이 작동하게 만들 수 있어, 객체지향의 개방/폐쇄 원칙을 실현할 수 있습니다. client 코드 변경 없이도, 새로운 기능을 확장할 수 있게 되는 것입니다.

그리고 팩토리 메서드와 추상 팩토리는 비슷한 생성 패턴이지만, 차이점이 있습니다. 팩토리 메서드는 단순히 객체 생성 과정을 서브 클래스에 위임하는 것을 목적으로 하는 반면, 추상 팩토리 패턴은 관련있는 여러 객체를 묶어, 매번 다른 기능을 만들더라도 client 코드에서는 일관성을 유지할 수 있도록 하는 것을 목적으로 합니다.

---

### Additional

#### 코드 예제 (typescript)

**전체 코드**

```ts
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
```

**추상 팩토리 인터페이스**

```ts
interface AbstractFactory {
  createProductA(): AbstractProductA;

  createProductB(): AbstractProductB;
}
```

추상 팩토리 인터페이스는 한 family안에 어느 Product들이 담기는지에 대해 명시해놓는 명세서라고 생각할 수 있다. 이제 이 추상 팩토리 인터페이스를 implementation하는 클래스들이 createProductA와 createProductB를 구현하면 된다.

**추상 팩토리 인터페이스로 팩토리 생성 클래스 구현**

```ts
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
```

ConcreteFactory1과 ConcreteFactory2는 추상 팩토리를 implementation한 클래스이고, 실제로 clientCode에 넣어줄 객체이다. 이 객체는 ConcreteFactory1과 ConcreteFactory2라는 클래스이자 family라고 볼 수 있고, Product를 생성하는 메소드를 가지고 있다.

자 이쯤에서 조금 정리해보자면, 이제껏 우리는 그룹을 만들었다고 생각할 수 있다. 그룹을 만드는데 필요한 조건은 AbstractFactory라는 인터페이스로 정해두고, ConcreteFactory1와 ConcreteFactory2는 이 조건을 충족시키고 구체화하면서 그룹을 형성한다. 그럼 이제 그 그룹에 들어갈 실제 product를 필요로 할 것이다.

**추상 Product 인터페이스**

```ts
interface AbstractProductA {
  usefulFunctionA(): string;
}
```

```ts
interface AbstractProductB {
  usefulFunctionB(): string;
  anotherUsefulFunctionB(collaborator: AbstractProductA): string; // Product A와 상호작용하는 메서드
}
```

먼저, Product의 종류로는 A,B가 있다. 그런데, 단지 각 그룹마다 A,B의 유형이 다른 것이다. 결국 본질은 같은데, 그룹에 따라 다른 것이 들어가는 것이다.

쉽게 예를 들면, A는 의자, B는 책상이라고 하자. 그러면 A1은 게이밍 의자, A2는 사무용 의자, B1은 게이밍 책상, B2는 사무용 책상인 것으로 비유할 수 있다는 것이다.

그런데 같은 그룹에 있는 product끼리는 서로 collaboration할 수 있어야 한다. 그래서 anotherUsefulFunctionB가 존재한다. 이 함수를 통해, 각 그룹이 어떻게 묶였는지 확인할 것이다.

**추상 Product 인터페이스로 Product 생성 클래스 구현**

```ts
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
```

```ts
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
```

이제 실제 product인 클래스들을 구현해주었고, 이들은 product의 인터페이스를 implementation하여 작성되었다.

**client Code**

```ts
function clientCode(factory: AbstractFactory) {
  const productA = factory.createProductA();
  const productB = factory.createProductB();

  console.log(productB.usefulFunctionB());
  console.log(productB.anotherUsefulFunctionB(productA));
}
```

clientCode는 인자로 factory를 받는다. 그런데 type은 단순히 AbstractFactory 인터페이스를 참조한다. 그말은 결국 clientCode 입장에서는 ConcreteFactory1이 들어오든, ConcreteFactory2가 들어오든 상관없이 동작한다는 의미이다. 두 클래스 모두 AbstractFactory 인터페이스 기반으로 implementation되었기 때문에, clientCode는 만약 ConcreteFactory3이 생겨도 코드 변경없이 똑같이 동작할 수 있다는 뜻이 된다.(개방/폐쇄 원칙)

clientCode에서는 factory 클래스의 인스턴스를 받아서 create 메소드를 호출하여 product를 만들어내고, product의 메소드들을 실행시킨다. 이때, 만약 문제가 생긴다면, factory 인스턴스를 생성한 클래스에게 문제가 있는 것이므로, 단일 책임 원칙도 지켜진다.

**결과**

```ts
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
```

실제로 clientCode를 작동시키는 부분이다. 동작하는 코드는 똑같지만, 어떤 인스턴스를 넣어주느냐에 따라서 결과가 달라진다.

---

### Reference

[추상 팩토리 패턴](https://refactoring.guru/ko/design-patterns/abstract-factory)

[[번역] 자바스크립트 디자인 패턴](https://www.devh.kr/2021/Design-Patterns-In-JavaScript/)

## Creational Pattern(생성 패턴) - Builder (빌더)

### Keyword

`변경 잦음`, `파라미터 많음`, `변경에 유연`, `결합도`, `응집도`

---

### Script

빌더 패턴은 변경에 대한 요구사항이 많거나, 클래스의 변수가 많고 이를 생성자에서 초기화해줘야 하는 경우에 유용하게 사용할 수 있는 패턴입니다.

생성자의 파라미터를 통해 멤버 변수를 초기화하는 것이 아니라, 체이닝을 통해 동적으로 값을 할당하고, 마지막으로 build 메소드가 호출하여 객체를 반환받을 수 있습니다.

빌더 패턴을 사용하면, 코드 가독성 문제를 해결할 수 있을 뿐 아니라, 필요한 데이터만 설정한 객체를 생성하고, 변경에 유연하게 대처할 수 있습니다.

즉, 빌더 패턴을 사용하지 않았을 때보다 clientCode의 수정을 최소화하여 결합도를 낮추고, 응집도가 높아 Builder 인터페이스의 수정과 Builder 클래스의 구현만으로 변경에 대응할 수 있습니다.

---

### Additional

#### 언제 Builder 패턴을 쓰나

**파라미터가 많이 필요한 생성자를 개선**
Builder 패턴은 생성자가 호출되는 시점에서 필요한 모든 변수의 값을 초기화하는 것이 아니다. 생성자 호출 이후, 필요한 메소드만 호출하여 동적으로 생성한다. 그리고 이는 build 메소드가 호출되기 전까지는 client에 노출되지 않기 때문에, 안전하게 객체를 생성할 수 있다.

점진적 생성자 패턴등을 개선할 수 있다.

**비슷한 단계를 가진, 세부사항만 조금씩 다른**
Builder 패턴은 생성되는 product가 세부사항만 다른 유사한 단계를 가진 여러 표현을 가질 때, 적용하면 좋다.

뼈대가 되는 Builder 인터페이스는 가능한 모든 생성 단계를 정의하고, 이를 구현한 클래스인 Builder들은 각자의 product를 만들 수 있다.

---

#### Builder 패턴 장점

**필요한 데이터만 설정할 수 있다.**
만약 특정 클래스의 객체마다 필요로 하는 데이터가 다르다면, 생성자의 파라미터를 통해 생성하는 방식에서는 그래도 아무 값이라도 넣어주어야 한다.

하지만 빌더 패턴을 사용하면, 동적으로 이를 처리하기 때문에, 불필요한 코드를 줄이고 필요한 데이터만 설정할 수 있다.

**유연성을 확보할 수 있다.**
만약 특정 클래스에 새로운 멤버 변수를 추가해주려고 한다고 가정하자. 그리고 이를 생성자의 파라미터를 통해 값을 받는다면, 기존에 이 클래스를 생성하는 코드들을 모두 수정해야하기 때문에 유연성이 떨어진다.

하지만 빌더 패턴에서는 동적으로 값을 할당하는 메소드를 통해 값을 넣어주기 때문에, 유연하게 대응할 수 있다.

**가독성을 높일 수 있다.**
생성자 파라미터를 통해 멤버 변수를 세팅하게 되면, 변수가 많아질 수록 어느 값이 무엇을 의미하는지 파악하기 어렵다. 하지만, 빌더 패턴을 활용하면, 직관적으로 어떤 값을 세팅하는지 쉽게 파악할 수 있어 가독성이 높아진다.

**변경 가능성을 최소화할 수 있다.**
Setter 메소드를 사용하여 값을 수정할 수 있는 기존의 방식은, 불필요하게 변경 가능성을 열어두는 행위가 될 수 있다. 빌더 패턴을 활용하면, 이 변경 가능성을 최소화할 수 있다.

---

#### Builder 패턴 단점

아무래도, Build 인터페이스를 기반으로 각 Builder 클래스가 생성되다보니, 코드의 전반적인 복잡성이 증가 한다.

---

#### Builder 패턴을 사용하는 것이 효율적이지 않은 경우

**객체의 생성을 라이브러리로 위임하는 경우**

**변수의 개수가 2개 이하이며, 변경 가능성이 없는 경우**

---

#### Director

사실 Director가 필수는 아니지만, 체이닝을 통해 단계를 구성하는 행위도 결국은 어느정도 정형화될 수 있다. 그것이 그리고 반복된다면, 반복을 없앨 수 있다. 그게 Director이다.

Director 클래스는 다양한 생성 루틴 메소드를 가지고 있어서, 생성자 파라미터로 builder를 받고, 생성 단계를 추상화할 수 있다.

그리고 이를 통해서 clientCode에게는 제품 생성의 세부 단계 및 정보를 은닉할 수 있다. client는 단순히 builder와 director를 연관시키고, 그들의 생성만 실행시켜, builder로부터 결과만 얻으면 된다.

---

#### Builder와 다른 패턴

**vs 추상 팩토리**
추상 팩토리는 관련된 객체들의 family를 생성하는데 중점을 두지만, 빌더는 복잡한 객체들을 step 별로 생성하는데 중점을 둔다. 그래서 추상 팩토리는 product를 즉시 반환하지만, builder는 제품을 가져오기 전에 추가 생성 step을 실행할 수 있다.

---

#### Builder 코드 예제 (typescript)

**전체 코드**

```ts
interface Builder {
  producePartA(): void;
  producePartB(): void;
  producePartC(): void;
}

class ConcreteBuilder1 implements Builder {
  private product!: Product1;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.product = new Product1();
  }

  public producePartA(): void {
    this.product.parts.push("PartA1");
  }

  public producePartB(): void {
    this.product.parts.push("PartB1");
  }

  public producePartC(): void {
    this.product.parts.push("PartC1");
  }

  public getProduct(): Product1 {
    const result = this.product;
    this.reset();
    return result;
  }
}

class Product1 {
  public parts: string[] = [];

  public listParts(): void {
    console.log(`Product parts: ${this.parts.join(", ")}\n`);
  }
}

class Director {
  private builder!: Builder;

  public setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  public buildMinimalViableProduct(): void {
    this.builder.producePartA();
  }

  public buildFullFeaturedProduct(): void {
    this.builder.producePartA();
    this.builder.producePartB();
    this.builder.producePartC();
  }
}

function clientCode(director: Director) {
  const builder = new ConcreteBuilder1();
  director.setBuilder(builder);

  console.log("Standard basic product:");
  director.buildMinimalViableProduct();
  builder.getProduct().listParts();

  console.log("Standard full featured product:");
  director.buildFullFeaturedProduct();
  builder.getProduct().listParts();

  console.log("Custom product:");
  builder.producePartA();
  builder.producePartC();
  builder.getProduct().listParts();
}

const director = new Director();
clientCode(director);

/** 실행 결과
 * Standard basic product:
 * Product parts: PartA1
 *
 * Standard full featured product:
 * Product parts: PartA1, PartB1, PartC1
 *
 * Custom product:
 * Product parts: PartA1, PartC1
 */
```

**Builder 인터페이스**

```ts
interface Builder {
  producePartA(): void;
  producePartB(): void;
  producePartC(): void;
}
```

Builder 인터페이스에는 가능한 모든 생성 단계를 정의한다. 즉, builder 인터페이스는 모든 유형의 builder들에게 공통적인 제품 생성 단계들을 선언한다.

**Builder 인터페이스로 Builder 클래스 구현**

```ts
class ConcreteBuilder1 implements Builder {
  private product!: Product1;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.product = new Product1();
  }

  public producePartA(): void {
    this.product.parts.push("PartA1");
  }

  public producePartB(): void {
    this.product.parts.push("PartB1");
  }

  public producePartC(): void {
    this.product.parts.push("PartC1");
  }

  public getProduct(): Product1 {
    const result = this.product;
    this.reset();
    return result;
  }
}
```

실제 builder 클래스는 반환할 객체인 product를 멤버 변수로 두고, 이를 생성자가 호출되었을 때 생성한다.

그리고 매번 각 단계에서는 프로세스를 반영하고, 마지막 build 메소드를 통해 결과적으로 완성된 객체를 반환한다.

즉, 구상 builder들은 생성 단계들의 다양한 구현을 표현한다. 또, 공통 인터페이스를 따르지 않는 product도 생산할 수 있다.

**Product 클래스**

```ts
class Product1 {
  public parts: string[] = [];

  public listParts(): void {
    console.log(`Product parts: ${this.parts.join(", ")}\n`);
  }
}
```

해당 코드 예제에서 Product 클래스는 다음과 같다.

**Director 클래스**

```ts
class Director {
  private builder!: Builder;

  public setBuilder(builder: Builder): void {
    this.builder = builder;
  }

  public buildMinimalViableProduct(): void {
    this.builder.producePartA();
  }

  public buildFullFeaturedProduct(): void {
    this.builder.producePartA();
    this.builder.producePartB();
    this.builder.producePartC();
  }
}
```

Director 클래스는 생성 단계를 호출하는 순서를 정의한다. 그래서 product의 특정 설정을 만들고 재사용할 수 있다.

**clientCode**

```ts
function clientCode(director: Director) {
  const builder = new ConcreteBuilder1();
  director.setBuilder(builder);

  console.log("Standard basic product:");
  director.buildMinimalViableProduct();
  builder.getProduct().listParts();

  console.log("Standard full featured product:");
  director.buildFullFeaturedProduct();
  builder.getProduct().listParts();

  console.log("Custom product:");
  builder.producePartA();
  builder.producePartC();
  builder.getProduct().listParts();
}
```

**실행 결과**

```ts
const director = new Director();
clientCode(director);

/** 실행 결과
 * Standard basic product:
 * Product parts: PartA1
 *
 * Standard full featured product:
 * Product parts: PartA1, PartB1, PartC1
 *
 * Custom product:
 * Product parts: PartA1, PartC1
 */
```

---

### Reference

[빌더 패턴](https://refactoring.guru/ko/design-patterns/builder)

[타입스크립트로 작성된 빌더](https://refactoring.guru/ko/design-patterns/builder/typescript/example)

[[번역] 자바스크립트 디자인 패턴](https://www.devh.kr/2021/Design-Patterns-In-JavaScript/)

[typescript 디자인패턴(0) — Builder(빌더) 패턴](https://siosio3103.medium.com/typescript-%EB%94%94%EC%9E%90%EC%9D%B8%ED%8C%A8%ED%84%B4-0-builder-%EB%B9%8C%EB%8D%94-%ED%8C%A8%ED%84%B4-90552ae0b763)

[#DESIGN-PATTERN, #CLASS 생성자 인자가 많을 땐? Builder!](https://tecoble.techcourse.co.kr/post/2020-08-17-builder_pattern/)

## Creational Pattern(생성 패턴) - Prototype (프로토타입)

### Keyword

`복제`, `객체 생성 비용`, `객체 생성 유연성`

---

### Script

Prototype 패턴은 원본 객체를 새로운 객체에 복사 및 수정하는 메커니즘을 따릅니다.

특히 Prototype 패턴은 객체를 새로 생성하는데 비용이 많이 들고, 이미 유사한 객체가 존재하는 경우에 효율적으로 사용할 수 있습니다.

그래서 Prototype 패턴은 객체 생성 비용을 줄이고, 객체 생성의 유연성을 높일 수 있습니다. 객체 생성 시에, 기존 객체를 복제 후 수정하는 과정으로 단순하게 새로운 객체를 생성할 수 있기 때문입니다.

---

### Additional

#### 언제 Prototype 패턴을 쓰나

다른 생성 패턴과 마찬가지로,

1. 생성 패턴은 시스템이 어떤 Concrete Class를 사용하는지에 대한 정보를 캡슐화한다.
2. 생성 패턴은 이들 클래스의 인스턴스들이 어떻게 만들고 어떻게 결합하는지에 대한 부분을 은닉한다.

이 덕분에, 생성 패턴을 사용하면 무엇이 생성되고, 누가 이것을 생성했으며, 이것이 어떻게 생성되는지, 언제 생성할 것인지를 결정하는데 유연성을 확보할 수 있다.

그리고 특히 Prototype 패턴은 객체를 새로 생성하는데 비용이 많이 들고, 이미 유사한 객체가 존재하는 경우에 효율적으로 사용할 수 있다.

또, 상태가 자주 변경되는 경우에도 적합한 디자인 패턴이다. 예를 들어, 게임에서 캐릭터를 생성하는 경우, 게임 내에서 해당 캐릭터의 능력치와 같은 속성은 자주 변하게 되는데, 새로운 속성을 추가하거나 할 때에도 새로운 객체의 속성만 변경하면 되는 이점이 있다. 또, 캐릭터 원형 객체를 생성하여 만들어 놓고, 새로운 캐릭터를 만들때마다 이를 복제하여 새로운 캐릭터를 생성하게 되면, 객체 생성 과정에서의 비용을 아낄 수 있다.

---

#### Prototype 패턴 장점

**객체 생성 과정의 오버헤드 감소**
객체 생성시에 모든 객체 요소를 새로 생성하지 않고, 기존 객체에서 복사하기 때문에, 상대적으로 객체 생성 과정에 필요한 오버헤드가 적어 성능상의 이점이 있다.

**객체 생성 과정에서 발생하는 문제 해결의 유연성**
복제를 통해, 객체 생성 과정이 단순해지기 때문에, 유연성이 높아진다.

---

#### Prototype 패턴 단점

**복잡한 객체 복제시 참조 및 상태 문제**
복잡한 객체(순환 참조 등)를 복제하는 경우, 객체 간의 참조 관계나 상태 등이 예상과 다르게 복제될 수 있다.

**객체 상태의 변경 가능성 고려해야 함**
Prototype 패턴을 사용해 생성된 객체는 원형 객체와 같은 초기 상태를 가지지만, 독립적인 공간에 할당된 독립된 객체이다. 이제 그들은 각자의 상태를 가지기 때문에, 고려해야할 객체 상태 값이 늘어나게 된다. 이는 객체 상태의 변경 가능성을 고려해야 하기 때문에, 코드의 복잡성이 높아질 수 있다는 단점으로 작용할 수도 있다.

---

#### Prototype 패턴을 사용하는 것이 효율적이지 않은 경우

**객체 생성 비용이 크지 않은 경우**
Prototype 패턴은 객체 생성 비용을 줄이기 위한 패턴이다. 그래서, 객체 생성 비용이 크지 않은 경우에는 굳이 사용할 필요가 없다.

**복잡한 객체를 생성할 때, 객체의 상태가 빈번하게 변경되는 경우**
복잡한 객체를 복제하면서 발생하는 참조 문제가 있을 수 있고, 객체의 상태가 빈번하게 변경되는 경우에 발생할 수 있는 side-effect도 존재할 수 있다.

**객체가 생성되는 빈도가 낮은 경우**
Prototype 패턴은 객체 생성 비용을 줄이기 위한 패턴이다. 그래서, 객체 생성 빈도가 많지 않은 경우에는 굳이 사용할 필요가 없다.

---

---

#### Prototype와 다른 패턴

**vs 추상 팩토리**
추상 팩토리 패턴 : 객체를 생성하는 추상적인 팩토리를 정의하고, 이를 사용하여 새로운 객체를 생성한다.
프로토타입 패턴 : 객체를 복제하여, 새로운 객체를 생성한다.

**vs 빌더**
빌더 패턴 : 복잡한 객체를 생성하는 패턴으로, 객체 생성 과정이 복잡하고, 이를 단계적으로 나누는 경우에 적합하다.
프로토타입 패턴 : 원형 객체를 복제하여 새로운 객체를 생성하는 패턴으로, 객체 생성 비용이 큰 경우나, 객체 생성 후에 객체 상태를 자주 변경해야 하는 경우에 적합하다.

**vs 팩토리 메서드**

---

#### Prototype 코드 예제 (typescript)

**전체 코드**

```ts
class Prototype {
  public primitive: any = null;
  public component!: object;
  public circularReference!: ComponentWithBackReference;

  public clone(): this {
    const clone = Object.create(this);

    clone.component = Object.create(this.component);
    // Object.assign(clone.component, this.component); // no work

    // backreference를 가진 nested object를 clone하는 경우는 아래와 같이 특수한 방법으로 복제해야 한다.
    // 복제된 후에는 original object가 아닌 cloned object를 pointing 해야 한다.
    // spread operator를 통해 이를 구현한다.
    clone.circularReference = {
      ...this.circularReference,
      prototype: { ...this },
    };

    return clone;
  }
}

class ComponentWithBackReference {
  public prototype;

  constructor(prototype: Prototype) {
    this.prototype = prototype;
  }
}

function clientCode() {
  const p1 = new Prototype();
  p1.primitive = 245;
  p1.component = new Date();
  p1.circularReference = new ComponentWithBackReference(p1);

  const p2 = p1.clone();
  if (p1.primitive === p2.primitive) {
    console.log(
      "Primitive field values have been carried over to a clone. Yay!"
    );
  } else {
    console.log("Primitive field values have not been copied. Booo!");
  }
  if (p1.component === p2.component) {
    console.log("Simple component has not been cloned. Booo!");
  } else {
    console.log("Simple component has been cloned. Yay!");
  }

  if (p1.circularReference === p2.circularReference) {
    console.log("Component with back reference has not been cloned. Booo!");
  } else {
    console.log("Component with back reference has been cloned. Yay!");
  }

  if (p1.circularReference.prototype === p2.circularReference.prototype) {
    console.log(
      "Component with back reference is linked to original object. Booo!"
    );
  } else {
    console.log("Component with back reference is linked to the clone. Yay!");
  }
}

clientCode();
```

---

### Reference

[프로토타입 패턴](https://refactoring.guru/ko/design-patterns/prototype)

[타입스크립트로 작성된 프로토타입](https://refactoring.guru/ko/design-patterns/prototype/typescript/example)

[[번역] 자바스크립트 디자인 패턴](https://www.devh.kr/2021/Design-Patterns-In-JavaScript/)

[[디자인패턴] 프로토타입패턴(Prototype Pattern)](https://velog.io/@newtownboy/%EB%94%94%EC%9E%90%EC%9D%B8%ED%8C%A8%ED%84%B4-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85%ED%8C%A8%ED%84%B4Prototype-Pattern)

## Creational Pattern(생성 패턴) - Singleton (싱글톤)

### Keyword

`인스턴스 1개`, `전역`, `동시성`

---

### Script

싱글톤 패턴은 단순하게 해당 클래스의 인스턴스가 1개만 생성되는 패턴입니다.

아무래도, 하나의 인스턴스만 생성하기 때문에 메모리 공간 측면에서의 이점이 있고, 이미 생성된 인스턴스를 활용하기 때문에, 속도 측면의 이점도 있습니다.

또, 싱글톤 인스턴스가 전역으로 사용되기 때문에, 다른 클래스들의 인스턴스가 접근하여 데이터를 공유하기 수월합니다. 물론 이때 동시성 문제가 발생할 수 있습니다.

하지만, 싱글톤 패턴은 멀티스레딩 환경에서 발생할 수 있는 동시성 문제도 해결해야하고, 테스트시에도 격리된 환경에서 테스트할 때는 매번 인스턴스의 상태를 초기화해줘야 합니다.

---

### Additional

#### 언제 Singleton 패턴을 쓰나

**특정 클래스에 대해, 전역 상태(global state)를 유지하는 경우**
예를 들어, 어떤 어플리케이션에서 데이터베이스 연결을 하나만 유지하고자 할 때, 싱글톤 패턴을 사용하여 해당 데이터베이스 연결 객체를 생성한다. 그리고 그 이후에는 항상 이 객체를 사용하도록 한다.

---

#### Singleton 패턴 장점

**유일한 인스턴스 보장**
싱글톤 패턴을 사용하면, 어떤 클래스의 인스턴스가 오직 하나만 생성된다.

**전역적인 접근성**
어디서든 해당 인스턴스에 접근할 수 있으므로, 애플리케이션 전반에서 사용되는 공통 객체에 대한 접근성을 쉽게 유지할 수 있다.

**메모리 사용량 감소**
인스턴스가 오직 하나만 생성되므로, 메모리 사용량이 감소하게 된다.

**인스턴스 생성 제어 가능**
싱글톤 패턴에서, 인스턴스를 생성하는 유일한 곳은 클래스 내부이므로, 객체 생성에 대한 제어가 클래스 내부에서 가능하다.

**전역 상태 관리**
특정 객체가 싱글톤으로 구현되면, 이를 사용하는 모든 클래스에서 동일한 객체를 사용하기 때문에, 데이터 일관성을 관리할 수 있다.

---

#### Singleton 패턴 단점

**테스트 어려움**
싱글톤 패턴에서는 해당 객체를 사용하는 모든 코드에서 동일한 인스턴스에 접근하게 된다.
그래서 의존성 문제나 초기화 문제, 테스트 결과 예측의 어려움 문제가 존재할 수 있다.

이 경우 의존성 주입을 통해 싱글톤 객체에 대한 의존성을 외부에서 주입하도록 설계하면 테스트 문제를 해결할 수 있다.

외부에서 객체를 주입받아 사용할 수 있기 때문에, 객체간의 결합도를 낮출 수 있고, 테스트 용이성도 향상된다.

---

#### Singleton 코드 예제 (typescript)

**전체 코드**

```ts
class Singleton {
  private static instance: Singleton;

  private constructor() {}

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  public someBusinessLogic() {
    // ...
  }
}

function clientCode() {
  const s1 = Singleton.getInstance();
  const s2 = Singleton.getInstance();

  if (s1 === s2) {
    console.log("Singleton works, both variables contain the same instance.");
  } else {
    console.log("Singleton failed, variables contain different instances.");
  }
}

clientCode();
```

---

### Reference

[singleton 패턴](https://refactoring.guru/ko/design-patterns/singleton)

[타입스크립트로 작성된 singleton](https://refactoring.guru/ko/design-patterns/singleton/typescript/example)

[[번역] 자바스크립트 디자인 패턴](https://www.devh.kr/2021/Design-Patterns-In-JavaScript/)

[싱글톤(Singleton) 패턴이란?](https://tecoble.techcourse.co.kr/post/2020-11-07-singleton/)

[[NestJS] 모든게 싱글톤 인스턴스 아니었어? (imports, providers 주의사항)](https://jay-ji.tistory.com/106)

## Structural Pattern(구조 패턴) - Adapter (어댑터)

### Keyword

`변환`, `단일 책임`, `데이터 변환 코드 분리`, `개방/폐쇄 원칙`

---

### Script

어댑터는 한 객체의 인터페이스를 다른 객체가 이해할 수 있도록 변환시켜주는 특별한 객체입니다.

이 객체를 통해, 수정할 수 없는 클래스에 대해서 기존 코드를 유지한채, 클라이언트 코드에서 사용할 수 있는 방식으로 변환하여 사용할 수 있게 됩니다.

이 디자인 패턴을 통해, 단일 책임 원칙을 지킬 수 있게 됩니다. 프로그램의 기본 로직에서, 데이터 변환 코드를 분리할 수 있게 됩니다. 또, 이는 기존 코드와 클라이언트 코드를 거의 고치지 않기 때문에, 기존 코드의 손상없이 새로운 유형의 어댑터를 도입할 수 있게되어, 개방/폐쇄 원칙도 지킬 수 있습니다.

---

### Additional

#### 언제 Adapter 패턴을 쓰나

**기존 클래스를 사용하고 싶지만, 그 인터페이스가 나머지 코드와 호환되지 않을때**
어댑터 패턴은 현재 코드와 legacy class, 타사 class 등의 기존 클래스 간의 변환기 역할을 하는 중간 레이어 클래스가 된다.

**부모 클래스에 공통 기능을 추가할 수도 없는데, 해당 기능이 여러 자식 클래스에서 쓰이는 경우**
만약 A라는 기능이 자식 클래스에서 필요로 해서, 각 자식 클래스에서 필요한 기능들을 넣었다고 치자. 그런데, 그 기능이 부모 클래스에 추가할 수는 없고, 자식 클래스 여러개에서만 적용되는 기능이다. 그럼 각각의 자식 클래스마다 이 메소드를 추가해줘야 한다. 코드가 굉장히 더러워질 것이다.

하지만 어댑터 클래스를 통해, 공통 인터페이스를 가지는 각 자식 클래스를 래핑하면, 필요한 기능을 동적으로 할당할 수 있게 된다.

---

#### Adapter 패턴 장점

**원래 호환되지 않던 일부 클래스들을 기존 앱과 호환**

**단일 책임 원칙 - 데이터 변환 코드의 분리**

**개방/폐쇄 원칙 - 기존 코드의 수정을 최소화하며, 새로운 유형의 어댑터 도입**

---

#### Adapter 패턴 단점

**추가 인터페이스와 클래스로 발생하는 오버헤드**

**원본 객체의 메서드가 static으로 선언되어, 인스턴스화 할 수 없는 경우**

---

#### Adapter 코드 예제 (typescript)

**전체 코드**

```ts
class Target {
  public request(): string {
    return "Target: The default target's behavior.";
  }
}

class Adaptee {
  public specificRequest(): string {
    return ".eetpadA eht fo roivaheb laicepS";
  }
}

class Adapter extends Target {
  private adaptee: Adaptee;

  constructor(adaptee: Adaptee) {
    super();
    this.adaptee = adaptee;
  }

  public request(): string {
    const result = this.adaptee.specificRequest().split("").reverse().join("");
    return `Adapter: (TRANSLATED) ${result}`;
  }
}

function clientCode(target: Target) {
  console.log(target.request());
}

console.log("Client: I can work just fine with the Target objects:");
const target = new Target();
clientCode(target);

console.log("");

const adaptee = new Adaptee();
console.log(
  "Client: The Adaptee class has a weird interface. See, I don't understand it:"
);
console.log(`Adaptee: ${adaptee.specificRequest()}`);

console.log("");

console.log("Client: But I can work with it via the Adapter:");
const adapter = new Adapter(adaptee);
clientCode(adapter);

/**
 * result
 *
 * Client: I can work just fine with the Target objects:
 * Target: The default target's behavior.
 *
 * Client: The Adaptee class has a weird interface. See, I don't understand it:
 * Adaptee: .eetpadA eht fo roivaheb laicepS
 *
 * Client: But I can work with it via the Adapter:
 * Adapter: (TRANSLATED) Special behavior of the Adaptee.
 */
```

---

### Reference

[adapter 패턴](https://refactoring.guru/ko/design-patterns/adapter)

[타입스크립트로 작성된 adapter](https://refactoring.guru/ko/design-patterns/adapter/typescript/example)

[[번역] 자바스크립트 디자인 패턴](https://www.devh.kr/2021/Design-Patterns-In-JavaScript/)

## Structural Pattern(구조 패턴) - Bridge (브릿지)

### Keyword

`구현부`, `추상층`, `기능 계층`

---

### Script

브릿지 패턴은 구현부에서 추상층을 분리해서, 각자 독립적으로 변형이 가능하고 확장할 수 있는 디자인 패턴입니다.

Abstraction이라는 기능 계층의 최상위 클래스를 두고, 구현부분에 해당하는 implementation의 인스턴스를 통해 구현부의 메소드를 호출합니다.

implementation 또한 추상 클래스로 되어 있고, 구현된 implementation의 인스턴스가 Abstraction에 전달됩니다.

브릿지 패턴을 통해, 모놀리식 클래스를 여러 클래스 계층구조로 나눌 수 있고, 각 클래스를 독립적으로 유지보수할 수 있는 장점이 있습니다.

![](https://velog.velcdn.com/images/kangdev/post/fbd26d6f-a427-4a7c-8c4d-85ca41e96913/image.png)

---

### Additional

#### 언제 Bridge 패턴을 쓰나

**여러 변형을 가진 모놀리식 클래스를 독립적으로 유지보수하려 할 때**
클래스가 다양한 데이터베이스 서버들과 작동할 수 있는 경우에, 각 데이터베이스 서버들은 서로 다른 인터페이스와 프로토콜을 사용한다. 이 때문에, 데이터베이스마다 코드를 수정해주어야 하는데, 브릿지 패턴을 사용하면, 클래스와 데이터베이스 서버 간의 인터페이스를 브릿지를 통해 연결할 수 있다. 이를 통해 다양한 플랫폼에 호환성을 유지할 수 있다.

---

#### Bridge 패턴 과 다른 패턴

**vs 어댑터**
브리지는 일반적으로 사전에 설계되며, 앱의 다양한 부분을 독립적으로 개발할 수 있도록 합니다. 반면에 어댑터는 일반적으로 기존 앱과 사용되어 원래 호환되지 않던 일부 클래스들이 서로 잘 작동하도록 합니다.

---

#### Bridge 코드 예제 (typescript)

**전체 코드**

```ts
class Abstraction {
  protected implementation: Implementation;

  constructor(implementation: Implementation) {
    this.implementation = implementation;
  }

  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `Abstraction: Base operation with:\n${result}`;
  }
}

class ExtendedAbstraction extends Abstraction {
  public operation(): string {
    const result = this.implementation.operationImplementation();
    return `ExtendedAbstraction: Extended operation with:\n${result}`;
  }
}

interface Implementation {
  operationImplementation(): string;
}

class ConcreteImplementationA implements Implementation {
  public operationImplementation(): string {
    return "ConcreteImplementationA: Here's the result on the platform A.";
  }
}

class ConcreteImplementationB implements Implementation {
  public operationImplementation(): string {
    return "ConcreteImplementationB: Here's the result on the platform B.";
  }
}

function clientCode(abstraction: Abstraction) {
  console.log(abstraction.operation());
}

let implementation = new ConcreteImplementationA();
let abstraction = new Abstraction(implementation);
clientCode(abstraction);

console.log("");

implementation = new ConcreteImplementationB();
abstraction = new ExtendedAbstraction(implementation);
clientCode(abstraction);
```

---

### Reference

[bridge 패턴](https://refactoring.guru/ko/design-patterns/bridge)

[타입스크립트로 작성된 bridge](https://refactoring.guru/ko/design-patterns/bridge/typescript/example)

[[번역] 자바스크립트 디자인 패턴](https://www.devh.kr/2021/Design-Patterns-In-JavaScript/)

## Structural Pattern(구조 패턴) - Composite (복합체)

### Keyword

`Composite`, `Leaf`, `Component`

---

### Script

Composite 패턴은 Composite(복합 객체)와 Leaf(단일 객체)를 동일한 Component로 취급하여, 클라이언트는 이 둘을 동일한 인터페이스로 사용할 수 있게끔 하는 구조 패턴입니다.

먼저, Leaf와 Composite을 묶는 공통 상위 인터페이스로, Component가 존재합니다. Composite과 Leaf는 operation() 추상 메서드를 정의하고, Composite 객체의 operation 메서드는 자기 자신을 호출하는 재귀 형태로 구현됩니다.

![](https://velog.velcdn.com/images/kangdev/post/cf31e0a4-8295-47d8-ac4a-ea015f31be59/image.png)

---

### Additional

#### 언제 Composite 패턴을 쓰나

**계층적 트리 표현을 다룰때**

**복잡하고 난해한 단일/복합 객체 관계를 단순화하고 균일하게 처리하고 싶을때**

---

#### Composite 패턴 장점

1. Composite과 Leaf를 동일하게 여기기 때문에, 같은 방식으로 클라이언트에서 다룰 수 있다.

2. 다형성 재귀를 통해 복잡한 트리 구조를 편리하게 구성할 수 있다.

3. 수평, 수직 모든 방향으로 객체를 확장할 수 있다.

#### Composite 패턴 단점

1. 재귀 호출의 특성 상 트리의 깊이가 깊어질 수록, 디버깅에 어려움이 생긴다.

2. 설계 단계에서 Leaf 객체와 Composite 객체를 모두 동일한 인터페이스로 다루어야 하는데, 이 설계가 상당히 까다롭다.

---

#### Composite 코드 예제 (typescript)

**전체 코드**

```ts
abstract class Component {
  protected parent!: Component | null;

  public setParent(parent: Component | null) {
    this.parent = parent;
  }

  public getParent(): Component | null {
    return this.parent;
  }

  public add(component: Component): void {}

  public remove(component: Component): void {}

  public isComposite(): boolean {
    return false;
  }

  public abstract operation(): string;
}

class Leaf extends Component {
  public operation(): string {
    return "Leaf";
  }
}

class Composite extends Component {
  protected children: Component[] = [];

  public add(component: Component): void {
    this.children.push(component);
    component.setParent(this);
  }

  public remove(component: Component): void {
    const componentIndex = this.children.indexOf(component);
    this.children.splice(componentIndex, 1);

    component.setParent(null);
  }

  public isComposite(): boolean {
    return true;
  }

  public operation(): string {
    const results: string[] = [];
    for (const child of this.children) {
      results.push(child.operation());
    }

    return `Branch(${results.join("+")})`;
  }
}

function clientCode(component: Component) {
  console.log(`RESULT: ${component.operation()}`);
}

const simple = new Leaf();
console.log("Client: I've got a simple component:");
clientCode(simple);
console.log("");

const tree = new Composite();
const branch1 = new Composite();
branch1.add(new Leaf());
branch1.add(new Leaf());
const branch2 = new Composite();
branch2.add(new Leaf());
tree.add(branch1);
tree.add(branch2);
console.log("Client: Now I've got a composite tree:");
clientCode(tree);
console.log("");

function clientCode2(component1: Component, component2: Component) {
  if (component1.isComposite()) {
    component1.add(component2);
  }
  console.log(`RESULT: ${component1.operation()}`);
}

console.log(
  "Client: I don't need to check the components classes even when managing the tree:"
);
clientCode2(tree, simple);
```

---

### Reference

[Composite 패턴](https://refactoring.guru/ko/design-patterns/Composite)

[타입스크립트로 작성된 Composite](https://refactoring.guru/ko/design-patterns/Composite/typescript/example)

[[번역] 자바스크립트 디자인 패턴](https://www.devh.kr/2021/Design-Patterns-In-JavaScript/)

[복합체 Composite-패턴-완벽-마스터하기](https://inpa.tistory.com/entry/GOF-%F0%9F%92%A0-%EB%B3%B5%ED%95%A9%EC%B2%B4Composite-%ED%8C%A8%ED%84%B4-%EC%99%84%EB%B2%BD-%EB%A7%88%EC%8A%A4%ED%84%B0%ED%95%98%EA%B8%B0)
