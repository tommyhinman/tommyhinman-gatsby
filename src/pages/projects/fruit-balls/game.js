import React from "react"
import {
  Bodies,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from "matter-js"
import { useEffect, useRef } from "react"

const balls = [
  //cherry
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/ad/ad16ccdc-975e-4393-ae7b-8ac79c3795f2.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //strawberry
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/0c/0cbb3dbb-2a85-42a5-be21-9839611e5af7.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //grape
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/d0/d0c676e4-0956-4a03-90af-fee028cfabe4.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //dekopan
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/74/74237057-2880-4e1f-8a78-6d8ef00a1f5f.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //orange
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/orange.png",
    xScale: 0.5,
    yScale: 0.5,
  },

  //apple
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/03/03c33f55-5932-4ff7-896b-814ba3a8edb8.png",
    xScale: 0.5,
    yScale: 0.5,
  },

  //pear
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/66/665a0ec9-6c43-4858-974c-025514f2a0e7.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //peach
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/84/84bc9d40-83d0-480c-b46a-3ef59e603e14.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  // pineapple
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/5f/5fa0264d-acbf-4a7b-8923-c106ec3b9215.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //   melon
  {
    texture:
      "https://suikagame.com/public/res/raw-assets/56/564ba620-6a55-4cbe-a5a6-6fa3edd80151.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //watermelon
  {
    texture:
      "https://playsuikagame.com/public/res/raw-assets/50/5035266c-8df3-4236-8d82-a375e97a0d9c.png",
    xScale: 0.5,
    yScale: 0.5,
  },
]

const radii = [15, 20, 27, 30, 38, 45, 48, 65, 78, 79, 100]

const Game = () => {
  const scene = useRef(null)
  const audio = useRef(null)
  const popAudio = useRef(null)
  const engine = useRef(
    Engine.create({
      gravity: {
        y: 0.8,
      },
    })
  )

  const bodies = new Map()

  useEffect(() => {
    const addBall = (x, y, type) => {
      const ball = balls[type]

      const fruit = Bodies.circle(x, y, radii[type], {
        render: {
          sprite: ball,
        },
        restitution: 0.5,
      })

      bodies.set(fruit.id, type)
      if (audio.current) {
        audio.current.play()
      }

      Composite.add(engine.current.world, [fruit])
    }

    const currentEngine = engine.current

    if (!scene.current) return

    const width = 430
    const height = 600

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
      },
    })
    const ground = Bodies.rectangle(0, height - 5, width * 2, 20, {
      isStatic: true,
      restitution: 0.9,
    })

    const leftWall = Bodies.rectangle(0, 0, 5, height * 2, {
      isStatic: true,
    })

    const rightWall = Bodies.rectangle(width - 5, 0, 5, height * 2, {
      isStatic: true,
    })

    Composite.add(engine.current.world, [leftWall, ground, rightWall])

    const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      })

    Composite.add(engine.current.world, mouseConstraint)

    Events.on(mouseConstraint, "mousedown", function (event) {
      var mousePosition = event.mouse.position
      const randomNum = Math.floor(Math.random() * radii.length)
      addBall(mousePosition.x, 25, randomNum)
    })

    Events.on(engine.current, "collisionStart", function (event) {
      var pairs = event.pairs

      // change object colours to show those starting a collision
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i]
        const typeA = bodies.get(pair.bodyA.id)
        const typeB = bodies.get(pair.bodyB.id)

        if (typeA === typeB) {
          Composite.remove(engine.current.world, [pair.bodyA, pair.bodyB])
        }
      }
    })

    Events.on(engine.current.world, "afterRemove", function (event) {
      const removedObject = event.object[0]
      const objectExists = bodies.has(removedObject.id)

      if (objectExists) {
        const newType = bodies.get(removedObject.id) + 1

        bodies.delete(removedObject.id)
        if (newType === radii.length) return
        if (popAudio.current) {
          popAudio.current.play()
        }
        addBall(
          removedObject.position.x,
          removedObject.position.y - 20,
          newType
        )
      }
    })

    Render.run(render)

    const runner = Runner.create({ isFixed: true })

    Runner.run(runner, engine.current)

    return () => {
      Render.stop(render)
      Engine.clear(currentEngine)
      render.canvas.remove()
      Composite.clear(currentEngine.world, false)
    }
  }, [])

  return (
    <>
      <div ref={scene}></div>
      <audio
        ref={audio}
        src="https://cdn.freesound.org/previews/104/104940_161750-lq.mp3"
      />
      <audio
        ref={popAudio}
        src="https://cdn.freesound.org/previews/447/447910_9159316-lq.mp3"
      />
    </>
  )
}

export default Game
