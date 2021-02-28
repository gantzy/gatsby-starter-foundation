---
template: blog-post
title: How to Make MOBA Style Movement with Unity
slug: /moba-style-movement-unity_setup
date: 2021-02-27 13:02
description: "MOBA Style Movement Tutorial for Unity. A quick look into how to
  move your character similarly to popular games like League of Legends and DotA
  2. "
featuredImage: /assets/moba_movement.jpg
---
In the last article I took a shot at reviewing Eternal Return: Black Survival and identifying a part of the game that would be interesting to implement into a Unity project. The first and probably the most straight forward issue was how to move in a MOBA style game. This type of movement is not unique to Eternal Return. This same movement can be seen in other top down, point and click games like League of Legends and Dota 2. Wild I know. Similar games have similar implementations of movement. Who woulda thunk. Well, lets stop talking about movement and go implement it, cuz gamers gonna game.

## Setting Up our Scene

For this run through we can just set up a basic 3D scene from the Unity Hub menu.

![Unity Hub New Project Settings](/assets/unity_hub_create_new.png "Unity Hub New Project Settings")

Ok phew, that was tough, but it gets easier! I think... As my good friends from Letterkenny would say, "Pitter patter, let's get at er!". To keep things simple and focused on movement, let's start by creating a terrain object in our scene. I didn't quite know too much about unity terrains until recently but I've been using them left and right. Should I be? Not sure, but dang they are fun. They also happen to make really quick and easy set ups for tutorials like this because they have everything we need built right into it, mainly a collider and they aren't affected by gravity. To get a terrain in, lets go to GameObject > 3D Object > Terrain.

Now that your terrain is created you probably have noticed ITS HUGE. Not quite over 9000 huge but big enough so lets tone that down a bit. With your terrain highlighted, lets go into the Inspector and on the terrain component you will see a gear icon. Click that and scroll to the Mesh Resolution section. We can turn this down from 1000 to around 100 or so. If you plan to continue on and make cool terrains, don't listen to me and do your own thing.

![Unity Terrain Mesh Resolution Settings](/assets/terrain_mesh_resolution.png "Unity Terrain Mesh Resolution Settings")

We now have a reasonable sized terrain, not to big, not too small. Just right. Once you are there we can take a step which really is core to how this style of movement works. Opening up a new tab from Unity for Navigation. Go to Window > AI > Navigation. Dock that where you would like and then click the tab `Bake` and once again click the button called `Bake`. What you should see is blue covering most of the terrain, all but the edges. If you do, then you are on the right track. We will cover what exactly is going on a bit later, I'm still figuring some of this out myself.

![Unity NavMesh Baked Area](/assets/nav_mesh_bake.png "Unity NavMesh Baked Area")

So our final bit of set up will just be to add a player character. For this we can just use a basic 3D capsule. GameObject > 3D Object > Capsule. We can move it to wherever you would like over the terrain but for now lets update its Y axis in the `Transform` in the `Inspector` to 1 so we are even with the ground.

![Unity 3D Capsule on Terrain](/assets/capsule_on_terrain.png "Creating a Capsule as Our Character")

### The Quest to Code

Great, setup is complete! We have done nothing to learn about MOBA style movement! Hold your horses. Although, I wish I could because that would mean I had horses. But I digress. Movement time for all. Time to create our first script! So first things first, create a folder underneath your Assets in your project view. You can call it.... you guessed it! `Scripts`! To create our script we can go to Assets > Create > C# Script. Lets name it `CharacterMovement`. Lets stare it for a second, not too creepily, but just enough to show our love for our first script.... Ok, enough weirdo, we get it. Just open it up. Phew, we got past our first awkward moment. Open up the file and just like every new script in Unity, we get a nice class all set up for us.

```csharp
using UnityEngine;

public class CharacterMovement : MonoBehaviour {
  void Start() {

  }

  void Update() {

  }
}
```

Now, its time to talk a little more about that blue stuff. When we pressed that bake button, one full awkward moment ago, it generated what is called a `NavMesh`. This allows any game object with the component `NavMeshAgent` (an agent who navigates on the mesh) to understand where it can travel to. That blue stuff is all of the valid places where the `NavMeshAgent` can go. Neato potato! Now that we have that understanding it should help us recognize what we are looking to do. We want to tell our game object where on the map to move to. Traditionally, MOBA style top down, point and click movement is done with a right mouse click. So lets jump into our code and start to track clicks and get our `NavMeshAgent` to move around. We will be working in the Update method for the time being.

```csharp
void Update() {
  if (Input.GetMouseButtonDown(1)) {
    // DO SOMETHING
  }
}
```

Pretty simple to track the mouse button click in game. This basically says that the first frame that captures a right mouse button click will return true. Why is there a `1`? That is just the number assignment to the mouse button. `0` is the left mouse button. So lets figure out what we need to do to tell our `NavMeshAgent` where they should go. Imagine you are sitting in front of your screen and you take your pointer finger and slowly move it towards a point on your screen. I say slow so you don't poke your screen out. Lawyerly advice. This is the same as, what they call in Unity, a `Raycast`. What we want to do is point and click and understand exactly where on the screen the user clicked. This is jumping right into the meat of the code so there will be some things that may not exactly make sense right away. Lets add this next chunk in.

```csharp
void Update() {
  if (Input.GetMouseButtonDown(1)) {
    RaycastHit hitInfo;

    if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hitInfo, Mathf.Infinity))
    {
      // Move the character
    }
  }
}
```

Sick, the code is starting to come together. What exactly is going here? We have some Physics mumbo jumbo, somehow the camera is involved, INFINITY!!! I'd go so far as to say this is just a bit too wild for me. And it was, for longer than I'll admit. But what is happening is that we are creating the finger pointing action right here. We are saying that from our Main Camera we want to create a line (`Raycast`) in the direction of our mouse click. If we do in fact hit something, lets put that info into our variable `hitInfo`. And our `Mathf.Infinity` is how far we want to check for a hit. Realistically you might want to shrink it to something manageable but this is a simple get started value. So now that we have something shooting magic `Raycast` beams at the objects in our game, lets do something with that information. For this we need to import a special Unity package, AI, dun dun dunnnnnn. Actually its not that scary, it is just the home of our good friend the `NavMeshAgent`.

```csharp
using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(NavMeshAgent))]
public class CharacterMovement : MonoBehaviour {
  private NavMeshAgent agent;
  
  void Start() {
    agent = GetComponent<NavMeshAgent>();
  }
    
  void Update() {
    if (Input.GetMouseButtonDown(1)) {
      RaycastHit hitInfo;

      if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hitInfo, Mathf.Infinity))
      {
        agent.SetDestination(hitInfo.point);
        agent.stoppingDistance = 0;
      }
    }
  }
}
```

A lot more code, but honestly a lot less to really focus on. We added into our `Start` method a way to get our `NavMeshAgent` component from our game object. This could also be done, and probably should be done in Awake, but since they gave us the \`Start\` method its just as well for the purposes of this exercise. Then in our `Update` method, when we successfully hit something we tell the `NavMeshAgent` to go to that destination and don't stop until we are directly on top of that location. The last part of this code that I want to cover is something that I wish was told to me much earlier on in my game development journey in Unity. That is the `RequireComponent` flag at the top of the class. This part is not required for the code to work, but what it does is automatically attach these components to the game object if they don't already exist. We know that this script doesn't work without a `NavMeshAgent` attached to the game object, so lets guarantee that there is one when we add this script. Super nifty and honestly really helpful when trying to create reusable components.

LETS HEAD BACK TO UNITY.

Our last step is to attach our new script to our capsule. Remember that neat little thing just one full paragraph ago that automatically adds components? Well if you attach the new `CharacterMovement` script you will see it also added that `NavMeshAgent` that we require for this script to work. Its basically magic and will save you so much time not having to check each and every script to figure out what is required. Finally lets adjust the camera so we can see a little bit better and everything should now be in place... Lets press play!

![MOBA Style Top Down Movement in Unity](https://media.giphy.com/media/o4tVL0ZQInrHjbpgmo/giphy.gif)

After clicking around a bit you can see it working. There you have it folks, a simple but effective way to move around your character using a point and click style, top down movement system seen in many MOBA games and other top down games. In our next article we will talk about how to keep the camera on the player as well as adding rotation to our character so they are always pointing forward. Maybe we will also unlock the camera and let you move the camera by going to the edge of the screens just like in your favorite games. Until then! (Seriously, stop staring at your script, you're creeping it out)