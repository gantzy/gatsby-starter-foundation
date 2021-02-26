---
template: blog-post
title: Getting Started With C# for Unity
slug: /getting-started-with-c-sharp-for-unity
date: 2021-02-25 21:01
description: C# Beginner Tutorial for Unity. Unity uses C# for the language of
  choice. This is a typed Language Tutorial for Unity Game Development.
featuredImage: /assets/csharp.jpg
---
# Getting Started With C# and Visual Studio
Getting into Unity has somewhat of a steep learning curve if you plan on coding your way to an awesome game. But fear not, it really isn't too steep. C# along with Visual Studio (which can be downloaded with your unity version) has a lot of really good helpers to get you started. So lets go over a few of these.

## Typed Languages
### What is a Typed Language?
"What the heck? I thought we were talking about Unity and tips for making games?!?!" - you might be saying to yourself, or even at the screen. Well, we are. But its all a journey to get to game development. Getting back to the topic at hand, a typed language is a programming language that enforces you give a type to everything you create. This is really important as it forces you to think about what everything will be and allows the Unity Engine to compile your code and execute it really super fast. Let's go over a few of these

```
    int
    bool
    string
    float
```
What might this jibberish be? Well these are basic types that can be applied to your variables. When you go to code you might assign this to the variable. Following this will be the value that you want that variable to be. For example
```
    int one = 1;
    bool isTrue = true;
    string text = "Hello World";
    float decimal = 1.23;
```
Each of the above examples is setting the value of each variable that you have typed. The formula being `{type} {name} = {value}`. The `decimal` variable is assigned the value `1.23`. But be careful, as the string value `Hello World` cannot under any circumstance be assigned to the float variable. This is where the typed language comes into play. Since `Hello World` is a string, as set by the variable above, it is not a float. Get it? You can only assign particular values to typed variables. Cool, lets move on to a more complex example.

As you get started with your Unity game development, you will find yourself creating many Classes within your C# code. One of the primary classes that you will use is a `Monobehaviour`. We will go over this in more detail in another post. For the sake of typed languages you might see something like this...
```
public class Character : MonoBehaviour {
    ...
}
```
First off, what does this mean? `Character` is a class. `MonoBehaviour` is also a class. What this is saying is that `Character` inherits all of the `MonoBehaviour` class. This is a good thing as MonoBehaviour handles the majority of Unity Engine lifecycle, such as when to create and update objects in your game. As a typed language, you can not only add basic value types to your variables, but you can also add class names to variables. Whoah! Thats mighty neat as I'd say. But how do you use it? Well it is exactly the same as if it were and `int` or a `bool`. Just put it before you variable name. Remember that formula mentioned above `{type} {name} = {value}`, well in this case `Character` would be our type. Super simple.

## Using a Typed Language for Unity
### Let's get this into some code to use!

All of this information is good to know for general purpose programming. When we are developing for games, how does this help us make our game? Think about it this way, every time something happens in your game there is some sort of interaction that must exist. For example, in a shooting game, everyone can fire a gun. But if you don't know who it hit, how do you deal damage to that person. We have to reference in our code a place where a `Character` is used. Let's first implement some basic code for Character. For this we will implement a simple function that allows a player to take damage. We will assume some of the variables already exist.
```
public class Character : MonoBehaviour {
    private int currentHealth = 100;

    public void TakeDamage(int damage) {
        currentHealth = currentHealth - damage;
    }
}
```
Ok, perfect, we have a Character with 100 health and can take damage. So before we finish implementing this, lets review some things that you might have noticed! We have 3 constructs. One class of Character, one variable of currentHealth and one method called TakeDamage. We have already gone over the class and variables, but last on this list is the method. Well, this actually has 2 types associated to it! The first is in the description of the function, `public void TakeDamage`. This is how most methods will look. The formula for methods go as follows `{visibility} {return TYPE} {name}`. Ignoring the private/public for now, we can see that this method has a return value of `void`, which just means that it does not return a value. This could also return an `int` or `Character` etc. If it is set to return one of those typed values then it must return that value or else you will run into errors when Unity tries to read your code.

The second part is what other parts of your code will pass into the method when it is invoked (this just means that you used this method). This part is tricky because it can contain any number of typed variables. In this case we have 1, `int damage`, but it could contain 3 or more, as well as 0 typed values.

Now that we have a basic understanding of what's going on, lets show how we might use the Character as a type! `Characters` don't just take damage, they also deal damage. Hmm, DealDamage, that sounds like a great function to add to our class. Lets get that in there! Nice call.

```
public class Character : MonoBehaviour {
    private int currentHealth = 100;

    public void TakeDamage(int damage) {
        currentHealth = currentHealth - damage;
    }

    public void DealDamage() {
        Character enemy = GameObject.FindGameObjectWithTag("Enemy");

        enemy.TakeDamage(10);
    }
}

(This code assumes there is a GameObject with the tag `Enemy` and the Character script added onto it)
```
Alright, sick. This code is complete. Once again, lets review our code and hopefully we are starting to see a pattern here. What we can see in our new method `DealDamage` is that we got a reference to a `Character` type! Woot! Since our variable has a very specific type, it knows that it has access to very specific methods. So now that we know the `enemy` is a `Character` we also know that the `Character` can `TakeDamage`.

This is the power of typed languages. Instead of assuming what things are, we can without a doubt ensure that specific variables and objects that you create in your game have specific ways of interacting with each other. You might think of some other ways to implement an interaction that might require this type of typed interaction, such as gaining experience or casting an ability. Honestly, the list of things you could come up with is endless, so let's get off of this article and back into Unity.