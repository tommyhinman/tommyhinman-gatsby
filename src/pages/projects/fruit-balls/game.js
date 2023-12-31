import React, { useState } from "react"
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
} from "matter-js"
import { useEffect, useRef } from "react"

const balls = [
  //cherry
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/cherry.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //strawberry
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/strawberry.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //grape
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/grape.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //dekopan
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/dekopan.png",
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
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/apple.png",
    xScale: 0.5,
    yScale: 0.5,
  },

  //pear
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/pear.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //peach
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/peach.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  // pineapple
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/pineapple.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //   melon
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/melon.png",
    xScale: 0.5,
    yScale: 0.5,
  },
  //watermelon
  {
    texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/watermelon.png",
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
        y: 0,
      },
    })
  )
  const [score, setScore] = useState(0)
  const scoreRef = useRef()
  scoreRef.current = score

  const [nextBall, setNextBall] = useState(null)
  const nextBallRef = useRef()
  nextBallRef.current = nextBall

  const bodies = new Map()
  let topWallId
  const bodiesTouchingTopWall = new Set()

  useEffect(() => {
    const width = Math.min(window.innerWidth, 600)
    const height = Math.min(window.innerHeight, 700)
    const addBall = (x, y, type, isPlaceHolderBall = false) => {
      const ball = balls[type]

      const fruit = Bodies.circle(x, y, radii[type], {
        render: {
          sprite: ball,
        },
        restitution: 0.5,
      })

      if (isPlaceHolderBall) {
        fruit.isSensor = true
        fruit.isStatic = true
      }

      bodies.set(fruit.id, type)

      Composite.add(engine.current.world, [fruit])

      return fruit
    }

    const clickHandler = () => {
      // First drop the real version of the current ball
      const currentBallType = bodies.get(nextBallRef.current.id)
      const currentBall = addBall(mouse.position.x, 25, currentBallType)

      // Then delete the current fake ball
      bodies.delete(nextBallRef.current.id)
      Composite.remove(engine.current.world, [nextBallRef.current])

      // Then make a new placeholder ball
      const randomNum = Math.floor(Math.random() * 6)
      const newBall = addBall(mouse.position.x, 25, randomNum, true)
      setNextBall(newBall)
    }

    // TODO clean this it's gross!
    const firstBall = addBall(width / 2, 25, 0, true)
    nextBallRef.current = firstBall
    setNextBall(firstBall)

    const currentEngine = engine.current

    if (!scene.current) return

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
    const visibleGround = Bodies.rectangle(width / 2, height - 1, width, 1, {
      isStatic: true,
      restitution: 0.9,
    })
    const ground = Bodies.rectangle(width / 2, height + 30, width, 60, {
      isStatic: true,
      render: { opacity: 0 },
    })

    const visibleLeftWall = Bodies.rectangle(0, height / 2, 1, height, {
      isStatic: true,
    })

    const leftWall = Bodies.rectangle(-30, height / 2, 60, height, {
      isStatic: true,
      render: { opacity: 0 },
    })

    const visibleRightWall = Bodies.rectangle(
      width - 1,
      height / 2,
      1,
      height,
      {
        isStatic: true,
      }
    )

    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height, {
      isStatic: true,
      render: { opacity: 0 },
    })

    const topWall = Bodies.rectangle(width / 2, 10, width, 2, {
      isStatic: true,
      isSensor: true,
      render: { opacity: 0 },
    })
    topWallId = topWall.id

    const background = Bodies.rectangle(width / 2, height / 2, width, height, {
      isStatic: true,
      isSensor: true,
      render: {
        sprite: {
          texture: "https://fruit-balls.s3.us-west-2.amazonaws.com/blue.png",
          xScale: 0.5,
          yScale: 0.5,
        },
        opacity: 0.5,
      },
    })

    Composite.add(engine.current.world, [
      visibleLeftWall,
      leftWall,
      visibleGround,
      ground,
      visibleRightWall,
      rightWall,
      topWall,
      background,
    ])

    const mouse = Mouse.create(render.canvas)

    window.addEventListener("click", clickHandler)

    window.addEventListener("mousemove", () => {
      nextBallRef.current.position.x = mouse.position.x
    })

    window.addEventListener("touchmove", () => {
      nextBallRef.current.position.x = mouse.position.x
    })

    window.addEventListener("touchend", clickHandler)

    Events.on(engine.current, "beforeUpdate", function () {
      const gravity = engine.current.gravity
      const bodies = Composite.allBodies(engine.current.world)

      const bodiesAffectedByGravity = bodies.filter(body => {
        return !body.isStatic && body !== nextBallRef.current
      })

      // console.log({ bodiesAffectedByGravity })

      // bodies.forEach(body => {
      //   if (body.id === nextBallRef.current.id) {
      //     Body.applyForce(body, body.position, {
      //       x: -gravity.x * gravity.scale * body.mass,
      //       y: -gravity.y * gravity.scale * body.mass,
      //     })
      //   }
      // })

      bodiesAffectedByGravity.forEach(body => {
        body.force.y += body.mass * 0.001
      })

      // nextBallRef.current.position.y = 25
      // nextBallRef.current.force.x = 0
      // nextBallRef.current.force.y = 0
      // nextBallRef.current.velocity.x = 0
      // nextBallRef.current.velocity.y = 0
      // nextBallRef.current.angularVelocity.
    })

    // const mouseConstraint = MouseConstraint.create(engine.current, {
    //   mouse: mouse,
    //   constraint: {
    //     stiffness: 0.2,
    //     render: {
    //       visible: false,
    //     },
    //   },
    // })

    // Composite.add(engine.current.world, mouseConstraint)

    Events.on(engine.current, "collisionStart", function (event) {
      const pairs = event.pairs

      for (var i = 0; i < pairs.length; i++) {
        const pair = pairs[i]

        const bodyAId = pair.bodyA.id
        const bodyBId = pair.bodyB.id

        if (bodyAId === topWallId || bodyBId === topWallId) {
          let bodyTouchingWall
          if (bodyAId === topWallId) {
            bodyTouchingWall = pair.bodyB
          }
          if (bodyBId === topWallId) {
            bodyTouchingWall = pair.bodyA
          }

          bodiesTouchingTopWall.add(bodyTouchingWall.id)

          setTimeout(() => {
            if (bodiesTouchingTopWall.has(bodyTouchingWall.id)) {
              console.log("you lose!")
              bodyTouchingWall.render.opacity = 0.1
            }
          }, 5000)
          return
        }

        const typeA = bodies.get(bodyAId)
        const typeB = bodies.get(bodyBId)

        if (typeA == null || typeB == null) return

        if (typeA === typeB) {
          const newPoints = (typeA + 1) * 2
          // console.log({ label: "before", score, newPoints })
          setScore(scoreRef.current + newPoints)
          // console.log({ label: "after", score, newPoints })
          // score.current = newPoints + score.current
          Composite.remove(engine.current.world, [pair.bodyA, pair.bodyB])
        }
      }
    })

    Events.on(engine.current, "collisionEnd", event => {
      const pairs = event.pairs

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i]

        const bodyAId = pair.bodyA.id
        const bodyBId = pair.bodyB.id

        if (bodyAId === topWallId || bodyBId === topWallId) {
          bodiesTouchingTopWall.delete(bodyAId)
          bodiesTouchingTopWall.delete(bodyBId)
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

    if (engine.current != null) {
      Render.run(render)

      const runner = Runner.create({ isFixed: true })

      Runner.run(runner, engine.current)
    }

    return () => {
      Render.stop(render)
      Engine.clear(currentEngine)
      render.canvas.remove()
      Composite.clear(currentEngine.world, false)
    }
  }, [])

  return (
    <>
      <div>Score: {score}</div>
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
