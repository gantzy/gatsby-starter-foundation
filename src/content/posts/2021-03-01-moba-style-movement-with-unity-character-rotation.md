---
template: blog-post
title: MOBA Style Movement with Unity - Character Rotation
slug: /moba-style-movement-rotation-with-unity
date: 2021-02-28 21:21
description: MOBA Style movement and character rotation in Unity just like your
  favorite games League of Legends, DotA2 and many other top down, point and
  click battle arena games. Come create your game with us, gamers gonna game.
featuredImage: /assets/rotation_bg_final.jpg
---
**Disclaimer:** If you are coming into this page fresh, you may want to check out the last article to get set up and into Unity with no problem. You can either go to the end of this article to go back or [Click Here](https://www.gonnagame.com/moba-style-movement-unity) to get started.

## My Unity Life (for Aiur)

Alright pals, its time to kick off another episode of random train of though mixed with Unity fun! I mean Character Movement for a MOBA game. Obviously. After our last tutorial we had a fully working character that moved where we clicked and it was freakin awesome, at least I thought so when I figured out how simple it could be. At the same time, I was like if its so simple how come it wasn't so easy for me? I've struggled with that since starting Unity development. But every time I end up with that thought, I find myself trying something new and another concept sticks and then another and then... you get the point. Unity development really has started to feel like its coming to me and that's part of this journey with you all. Learning and sharing.

Speaking of learning, one of the best things I've found myself doing is while playing games I just start pointing out specific areas that I get curious about. Also, the rare, "Ooooh I know how they did that!" moment. It helps to be able to identify these features and from my time playing Eternal Return: Black Survival, it was easy to identify this set of articles to jump into. So without further ado, lets jump into getting our character rotating!

## The Meat and Bones

I'll be honest, I originally chose a capsule because it is pretty difficult to see what's actually happening with the object as its moving around the screen. Since its rounded you can't exactly see it rotating without a pair of sniper eyes. Yeh, I know it looks so cool having our capsule follow our mouse clicks and that's like 90% of MOBAs. But one of the things that can really make it feel clunky is poor character rotation. So lets take our script from where we left off.

```csharp
using UnityEngine;
using UnityEngine.AI;

[RequireComponent(typeof(NavMeshAgent))]
public class CharacterMovement : MonoBehaviour
{
    private NavMeshAgent agent;

    void Start()
    {
        agent = GetComponent<NavMeshAgent>();
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(1))
        {
            RaycastHit hitInfo;

            if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hitInfo, Mathf.Infinity))
            {
                agent.SetDestination(hitInfo.point);
                agent.stoppingDistance = 0;
            }
        }
    }
```

We will be adding one line, but its a really good test to see what is actually happening and why our Character Movement script isn't quite complete. The ellipsis means to leave the code around this section the same, we will continue to use this convention in other spots.

```csharp
...
void Update() {
  Debug.DrawRay(transform.position, transform.forward * 5f, Color.red);
  ...
}
...
```

What exactly did we just add? This is a debug tool that allows us to draw lines on the screen so we can help visualize where we are drawing rays from. The values that we've placed in here is the start and the end of the ray. Since we are trying to see what direction our character is facing we set the start to where we are standing and then the end position at 5 units away in the direction that the character is facing (transform.forward). The last value is optional and this is just to color it red so its easily visible in the game. Lets head back into unity for a moment and see what happens when we run our code. Note: If you don't see a red line appear out of your capsule character, make sure that you have the Gizmos selected in the top right of your game screen.

![Slow MOBA Character Rotation](https://media.giphy.com/media/b8NEVRhU0DdJuPNxmd/giphy.gif "Slow Character Rotation")

Oof, the rotation of the character is super slow and unrealistic for a MOBA style game that relies on quick reflexes and snap movements. This just won't work. If this style of movement is what you are looking for, awesome! Go away. YOU DON'T NEED US. But that's ok, every game is different. Not salty... At all. But noticing that funky fresh red line to help us visualize what is happening is really cool and can be used in so many other situations. Pocket that little tidbit and lets keep going.

Lets take a second to think about exactly what we might want for our MOBA. We want turn speeds to be quick and make sense. So they can't be instant since that isn't realistic, but they can't be so slow that our character is running backwards half of the time. There are actually a few ways to do this. Taking a look at our first option:

\### Slerp(ing) for the win

If you've been around before, you will no doubt have seen methods like Lerp and Slerp. Nope, not what you do when eating a hot, delicious bowl of ramen. Its definitely something that took me a moment to remember. But both of these are short for Linear Interpolation and Spherical Linear Interpolation, respectively. Wow, that really simplified it for us /s. I'm no math genius but the long and short of it is linear interpolation determines a point on a straight line and spherical linear interpolation finds a point on a curve. So between point A, your start position, and point B, the final destination, it will determine how far along that path you are and will return that point. Seems simple enough.

Now that we have a basic understanding of Lerp and Slerp, which one do we use? In this particular case we want to use Slerp. The reason for this is because we are doing a rotation and rotations happen on a circular plane. You remember the 360 degrees they taught you at some point. If we used Lerp for this situation we would end up with a situation where the character starts to spin real slow and then pick up really fast and then slow down again towards the end of the Lerp. This is because Lerp is really useful for positions, going from point A to B. In our case we aren't moving our character, just rotating it. One last thing to determine is what sort of variables we might want for our Slerp. We will want to know how long our character should take to rotate, and whether or not our character should be rotating. Lets jump into some code.

```csharp
...
public class CharacterMovement : MonoBehaviour {
  [SerializeField]
  private float timeToRotate = .5f;
  
  private float timeRotating = 0f;
  private bool isRotating;
  private Vector3 target;
  
  ...
  
  void Update() {
    ...

      if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hitInfo, Mathf.Infinity))
      {
        ...
        target = hitInfo.point;
        timeRotating = 0;
        isRotating = true;
      }
    }

    if (isRotating == true) {      
      RotateToTarget();
    }
  }
  
  private void RotateToTarget() {
    timeRotating += Time.deltaTime;

    Vector3 targetPosition = new Vector3(target.x, transform.position.y, target.z);

    Quaternion targetRotation = Quaternion.LookRotation(targetPosition - transform.position);

    transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, timeRotating / timeToRotate);

    if (timeRotating >= timeToRotate)
    {
      isRotating = false;
    }
  }
}
```

What the heck man, you just blasted us with some code. Where to begin. First thing is first, we need to know how long our rotation is and how much time we've spent rotating. Therefore we've set up two variables `timeRotating` and `timeToRotate`. We mark `timeRotating` as a `SerializedField` so that we can edit it in our editor. Yes, you can mark it as public, but we want to keep our code clean and the more restrictive your variables, typically the better. So to keep things simple the first thing we do in our `RotateToTarget` code is add the amount of time in between frames and add that to the `timeRotating` variable. Notice that we set the `timeRotating` variable to 0 in the Update method. This is so that each time we attempt to move, it restarts our Slerp movement. We don't want to be clicking quickly and start halfway through the next rotation because we forgot to reset it.

Next up is our `targetPosition`. Didn't we already get that information in the last article, why not just use the point that was generated from the `Raycast`. The reason for this is that we are clicking on the terrain that we set up. The point that we are actually clicking has 3 values for its position, X, Y and Z. Since we are only dealing with where we want the character to move, we are only interested right now in the X and Z axis. What you would otherwise notice is that the character will start to look down the closer you get to the target position. So to remedy that, we've created this `targetPosition` variable that only uses the target point's X and Z position. Now our character will always be looking forward no matter its position.

### You Spin Me Right Round Baby, Right Round

Now for the fun stuff. Quaternion anything can really be a pain to wrap your head around if you've never worked with it before, just like myself. Even now, I am reading forum posts and articles to make sure information is correct. So, lets get into it! `Quaternion.LookRotation`, boy does that sound fun. I bet it finds you a look rotation if you give it a start and end point. Unfortunately, that's not quite how it works. It instead works off of a global direction value and converts that positional direction into a Quaternion value from a starting direction. To explain a little bit more on this code, we are taking our target position and subtracting our current position giving us a directional value. So the value we get is the direction from our character to the position. This direction when applied to the position of (0, 0, 0) can be converted into a set of angles for our rotation. What exactly is the starting point? Well by default it uses the value of `Vector3.up` but this value can be set if you choose to. It isn't important for our use case here.

Time to Slerp! At this point we have everything we need, how much time we've already rotated, where we are rotating to, now we just have to figure out at what point of the rotation we are at. So, what we do is we take our starting rotation, our final rotation and we apply a clamped value between 0 and 1 to say how far along we are in the rotation. A clamped value just means that no matter what value you supply it, it can't be more than the value of 1 and no less than the value of 0. Pretty straightforward. Now we see why we needed to keep track of time spent rotating. The closer we get to our `timeToRotate`, the further we need to rotate our character.

Last bit of code is just to tell our character that we don't need to run this anymore since we are correctly facing our target. Once again, lets get back into Unity to test this code out! Our MOBA movement is probably, most likely so awesome!

![MOBA Character Rotation Wobble](https://media.giphy.com/media/o6zgsYNBARiw5A7p5Y/giphy.gif "MOBA Character Rotation Wobble")

Oi, as we start to click around, it starts off so well! But then you might notice the character wobbling when clicking before the target reaches its destination. What we have going on is a competing rotation! We forgot to tell the `NavMeshAgent` to stop its rotation and just let us do it ourselves. Good thing this is a one line fix.

```csharp
...
void Start() {
  ...
  agent.angularSpeed = 0;
}
...
```

This little nugget will turn off the `NavMeshAgent`'s built in rotation and just let our code run. In the end, this is the first of multiple different ways to get our characters rotating. This particular one is really good if you want quick snappy responses, as a change in value will result in automatic movements and changes in directions, but not all games want that. Also, Quaternions can be difficult to wrap your mind around. I know I've struggled with it. But as they say, practice makes perfect. This type of Lerp/Slerp code will almost be guaranteed to show up again in your projects so getting used to it now is super helpful. I find the more that I grasp this concept, the more I feel like I'm able to really grasp the 3D world of game dev. But off to play some Eternal Return, cuz gamers gonna game.