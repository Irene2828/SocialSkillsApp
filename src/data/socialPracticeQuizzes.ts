import { SocialPracticeQuiz } from './types';

export const socialPracticeQuizzes: SocialPracticeQuiz[] = [
  // Family 1: Friendly Greetings
  {
    id: "greet-1",
    familyId: "friendly-greetings",
    title: "Morning at the School Gate",
    ageRange: "7-8",
    skillName: "Friendly Greetings",
    situation: {
      setting: "Outside the school gate on Monday morning",
      characters: [
        { name: "Leo", description: "Your classmate" },
        { name: "Mr. Davis", description: "The friendly crossing guard" }
      ],
      introduction: "You are walking up to the school gate. You see Mr. Davis helping kids cross, and your friend Leo is standing near the fence looking at his new backpack."
    },
    questions: [
      {
        id: "greet-1-q1",
        type: "notice-signal",
        prompt: "You see Mr. Davis wave and say 'Good morning!' to you as you walk up. What is the friendly thing to do?",
        hint: "When someone says hello, it's friendly to acknowledge them back.",
        options: [
          {
            id: "opt1",
            text: "Look away and keep walking.",
            isAccepted: false,
            feedback: "If you ignore someone who says hello, they might think you are upset or ignoring them on purpose."
          },
          {
            id: "opt2",
            text: "Wave back and say 'Morning!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! A quick wave and a short greeting shows you noticed him and are being friendly."
          },
          {
            id: "opt3",
            text: "Nod and give a small smile.",
            isAccepted: true,
            feedback: "That works too! A smile and nod is a polite and quiet way to say hello."
          }
        ]
      },
      {
        id: "greet-1-q2",
        type: "choose-response",
        prompt: "You walk over to Leo. He looks up from his backpack. How can you greet him?",
        hint: "Think of a casual, friendly way to say hello to a classmate.",
        options: [
          {
            id: "opt1",
            text: "Say 'Hi Leo, cool backpack!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Great! Saying hi and giving a small compliment is a really friendly way to start a conversation."
          },
          {
            id: "opt2",
            text: "Say 'Hey Leo.'",
            isAccepted: true,
            feedback: "That's a solid, simple greeting. It lets him know you're happy to see him."
          },
          {
            id: "opt3",
            text: "Stand next to him silently and stare at his bag.",
            isAccepted: false,
            feedback: "Standing silently might make Leo feel confused. It's usually better to say a quick hello so he knows you are there to be friendly."
          }
        ]
      },
      {
        id: "greet-1-q3",
        type: "understand",
        prompt: "Leo smiles and says, 'Thanks! I got it this weekend.' Why is it important that you said hello first?",
        hint: "Greetings help people feel comfortable and noticed.",
        options: [
          {
            id: "opt1",
            text: "Because it's a strict rule.",
            isAccepted: false,
            feedback: "It's not just a strict rule; it has a real purpose in how it makes people feel."
          },
          {
            id: "opt2",
            text: "It shows him I am friendly and ready to chat.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Greetings are like opening a door to a conversation."
          },
          {
            id: "opt3",
            text: "So I can take his backpack.",
            isAccepted: false,
            feedback: "That wouldn't be very kind! We greet people to connect with them."
          }
        ]
      },
      {
        id: "greet-1-q4",
        type: "repair",
        prompt: "Imagine you walked up to Leo and said 'Cool backpack!' but forgot to say hi. Leo looks a little surprised. How can you fix it?",
        hint: "You can always add a greeting even if you started with something else.",
        options: [
          {
            id: "opt1",
            text: "Run away because you made a mistake.",
            isAccepted: false,
            feedback: "It's just a tiny mistake! Running away would make it much more awkward."
          },
          {
            id: "opt2",
            text: "Just add, 'Oh, hey Leo! Good morning.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! It's never too late to slip a friendly 'hello' into the conversation."
          },
          {
            id: "opt3",
            text: "Tell him he should have said hi first.",
            isAccepted: false,
            feedback: "Blaming him isn't fair and might start an argument."
          }
        ]
      },
      {
        id: "greet-1-q5",
        type: "transfer",
        prompt: "Later, you see your teacher in the hallway. Should you greet your teacher the same way you greeted Leo?",
        hint: "Adults usually expect slightly different greetings than kids.",
        options: [
          {
            id: "opt1",
            text: "Yes, just say 'Hey!'",
            isAccepted: true,
            feedback: "This is okay, but some teachers prefer a more polite greeting."
          },
          {
            id: "opt2",
            text: "Say 'Good morning, Mr. Smith.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on! Using their name and 'Good morning' is very polite for a teacher."
          },
          {
            id: "opt3",
            text: "Ignore them unless they speak first.",
            isAccepted: false,
            feedback: "It's friendly to be the first one to say hello to a teacher!"
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Greeting people is like unlocking a door. It lets them know you are friendly and ready to connect!",
      realLifePractice: "Today, try saying 'Good morning' or 'Hi' to two people at school."
    }
  },
  {
    id: "greet-2",
    familyId: "friendly-greetings",
    title: "Joining a Game at Recess",
    ageRange: "7-8",
    skillName: "Friendly Greetings",
    situation: {
      setting: "The playground during morning recess",
      characters: [
        { name: "Sam", description: "A kid from another class" },
        { name: "Maya", description: "Your friend" }
      ],
      introduction: "You see Maya and Sam tossing a ball back and forth. You want to join them."
    },
    questions: [
      {
        id: "greet-2-q1",
        type: "choose-response",
        prompt: "You walk over to them. How should you let them know you're there?",
        hint: "Think of a friendly way to announce you have arrived.",
        options: [
          {
            id: "opt1",
            text: "Grab the ball when it rolls near you.",
            isAccepted: false,
            feedback: "Grabbing the ball without asking might annoy them. It's better to use words first."
          },
          {
            id: "opt2",
            text: "Say 'Hi guys, what are you playing?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Great! A greeting plus a question shows you are interested in what they are doing."
          },
          {
            id: "opt3",
            text: "Wave and wait for them to notice you.",
            isAccepted: true,
            feedback: "This is a polite start, but you might have to wait a while if they are focused on the ball."
          }
        ]
      },
      {
        id: "greet-2-q2",
        type: "notice-signal",
        prompt: "Maya says, 'Hi! We're just throwing the ball around.' She smiles at you. What does her smile tell you?",
        hint: "Body language gives us clues about how people feel.",
        options: [
          {
            id: "opt1",
            text: "She wants me to go away.",
            isAccepted: false,
            feedback: "Usually, a smile means someone is happy or friendly, not upset."
          },
          {
            id: "opt2",
            text: "She is happy I said hello and doesn't mind me being there.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. Her smile and friendly tone mean you are welcome."
          },
          {
            id: "opt3",
            text: "She is laughing at me.",
            isAccepted: false,
            feedback: "A friendly smile is different from laughing at someone. Her words were nice, too!"
          }
        ]
      },
      {
        id: "greet-2-q3",
        type: "choose-response",
        prompt: "You want to play too. What can you say next?",
        hint: "It's always best to ask to join in directly.",
        options: [
          {
            id: "opt1",
            text: "'Can I play with you guys?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! Asking directly is the clearest and most polite way to join."
          },
          {
            id: "opt2",
            text: "'I'm really good at catching.'",
            isAccepted: true,
            feedback: "This shows you are interested, but you still need to actually ask if you can join."
          },
          {
            id: "opt3",
            text: "'Throw it to me right now!'",
            isAccepted: false,
            feedback: "Demanding the ball sounds bossy. Asking politely works much better."
          }
        ]
      },
      {
        id: "greet-2-q4",
        type: "repair",
        prompt: "Sam says, 'Sure!' but he accidentally throws the ball too high, and it goes over your head. You yell, 'Hey, bad throw!' Sam looks sad. How can you repair this?",
        hint: "Everyone makes mistakes. We should make sure our friends feel okay.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Oops, I didn't mean to yell. I'll go get it!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Great repair! You apologized and offered to help fix the situation by getting the ball."
          },
          {
            id: "opt2",
            text: "Tell him to go fetch it himself.",
            isAccepted: false,
            feedback: "This would make Sam feel even worse. Friends help each other out."
          },
          {
            id: "opt3",
            text: "Say, 'Sorry, the sun was in my eyes.'",
            isAccepted: true,
            feedback: "Saying sorry helps, but it's even better to take responsibility instead of making an excuse."
          }
        ]
      },
      {
        id: "greet-2-q5",
        type: "understand",
        prompt: "Why is it important to ask to join a game instead of just jumping in?",
        hint: "Think about how it feels when someone interrupts what you are doing.",
        options: [
          {
            id: "opt1",
            text: "Because jumping in might ruin their game or startle them.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Asking gives them a chance to say yes and include you smoothly."
          },
          {
            id: "opt2",
            text: "Because the teachers are watching.",
            isAccepted: false,
            feedback: "We ask politely because we care about our friends' feelings, not just because someone is watching."
          },
          {
            id: "opt3",
            text: "Because I might trip and fall.",
            isAccepted: false,
            feedback: "While true, the main reason is to respect the people already playing."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "A friendly hello and a polite question are the best tools for joining in on the fun!",
      realLifePractice: "Next time you see kids playing a game you like, practice walking up and saying, 'Hi, can I play?'"
    }
  },
  {
    id: "greet-3",
    familyId: "friendly-greetings",
    title: "Greeting a Guest at Home",
    ageRange: "7-8",
    skillName: "Friendly Greetings",
    situation: {
      setting: "Your living room, Saturday afternoon",
      characters: [
        { name: "Aunt Sarah", description: "Your aunt visiting from out of town" }
      ],
      introduction: "The doorbell rings. Your mom opens the door, and it's Aunt Sarah! She has her suitcase and a big smile."
    },
    questions: [
      {
        id: "greet-3-q1",
        type: "choose-response",
        prompt: "Aunt Sarah walks in and looks excited to see you. How can you greet her?",
        hint: "Think of a warm, welcoming greeting for a family member.",
        options: [
          {
            id: "opt1",
            text: "Hide behind the couch.",
            isAccepted: false,
            feedback: "Hiding might make Aunt Sarah feel sad that you don't want to see her."
          },
          {
            id: "opt2",
            text: "Say 'Hi Aunt Sarah!' and give her a hug if you want to.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! A cheerful hello makes guests feel welcome."
          },
          {
            id: "opt3",
            text: "Just wave from across the room.",
            isAccepted: true,
            feedback: "A wave is okay, but saying 'hi' out loud makes it even friendlier."
          }
        ]
      },
      {
        id: "greet-3-q2",
        type: "understand",
        prompt: "Aunt Sarah says, 'Wow, you've grown so much!' What does she mean when she says this?",
        hint: "Adults often say this when they haven't seen you in a while.",
        options: [
          {
            id: "opt1",
            text: "She thinks I am a giant.",
            isAccepted: false,
            feedback: "Not quite! It's just an expression."
          },
          {
            id: "opt2",
            text: "She's just making friendly conversation because she missed me.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. It's a very common, friendly thing adults say when they haven't seen you in a long time."
          },
          {
            id: "opt3",
            text: "She thinks my clothes don't fit.",
            isAccepted: false,
            feedback: "She's just happy to see you and noticing that you are getting older."
          }
        ]
      },
      {
        id: "greet-3-q3",
        type: "choose-response",
        prompt: "How can you respond when she says you've grown so much?",
        hint: "Keep it simple and polite.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Yep! I'm seven now!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Great! This agrees with her and gives a little piece of information to keep the chat going."
          },
          {
            id: "opt2",
            text: "Say nothing and walk away.",
            isAccepted: false,
            feedback: "Walking away in the middle of a greeting can seem rude."
          },
          {
            id: "opt3",
            text: "Say, 'Thanks!'",
            isAccepted: true,
            feedback: "This is polite and simple, a perfectly fine response."
          }
        ]
      },
      {
        id: "greet-3-q4",
        type: "notice-signal",
        prompt: "Aunt Sarah puts her heavy suitcase down and takes a deep breath. She says, 'Phew, what a long drive!' What is she signaling?",
        hint: "Pay attention to her words and her actions (putting the bag down).",
        options: [
          {
            id: "opt1",
            text: "She wants to go for a run.",
            isAccepted: false,
            feedback: "If she had a long drive and took a deep breath, she's probably tired."
          },
          {
            id: "opt2",
            text: "She is tired and might need to rest or sit down for a minute.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on! When adults say they had a long drive, they usually want to relax for a moment."
          },
          {
            id: "opt3",
            text: "She wants me to carry her suitcase.",
            isAccepted: false,
            feedback: "She might appreciate help, but she's mostly expressing that she's tired."
          }
        ]
      },
      {
        id: "greet-3-q5",
        type: "transfer",
        prompt: "Knowing she is tired, what would be a kind and welcoming thing to do next?",
        hint: "Think about how you can make a tired guest comfortable.",
        options: [
          {
            id: "opt1",
            text: "Ask her to play tag outside immediately.",
            isAccepted: false,
            feedback: "Since she is tired, she might need to rest before playing active games."
          },
          {
            id: "opt2",
            text: "Say, 'Do you want to sit down on the couch?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "That is incredibly thoughtful! Offering a tired guest a place to sit is very polite."
          },
          {
            id: "opt3",
            text: "Show her a drawing you made.",
            isAccepted: true,
            feedback: "This is nice, but she might want to sit down first while she looks at it."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Greeting guests warmly and noticing how they feel makes them feel happy and welcome in your home.",
      realLifePractice: "When someone visits your house, try being the first one to say 'Welcome!'"
    }
  },
  // Family 2: Polite Refusing
  {
    id: "refuse-1",
    familyId: "polite-refusing",
    title: "Saying No to a Game",
    ageRange: "7-8",
    skillName: "Polite Refusing",
    situation: {
      setting: "Recess time on the playground",
      characters: [
        { name: "Jamie", description: "A classmate who loves active games" }
      ],
      introduction: "You are sitting on a bench reading your favorite comic book. Jamie runs up and asks, 'Hey! Do you want to play monster tag with us?'"
    },
    questions: [
      {
        id: "refuse-1-q1",
        type: "understand",
        prompt: "You really want to keep reading right now. Is it okay to say no to Jamie?",
        hint: "Think about your own boundaries and what you want to do.",
        options: [
          {
            id: "opt1",
            text: "No, you always have to say yes to friends.",
            isAccepted: false,
            feedback: "It's important to be kind, but you are allowed to choose what you want to do with your free time."
          },
          {
            id: "opt2",
            text: "Yes, it is perfectly okay to say no if you don't want to play.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! You have the right to decide how you spend your recess."
          },
          {
            id: "opt3",
            text: "Only if you say it in a mean way.",
            isAccepted: false,
            feedback: "You can say no, but it's always best to be polite about it."
          }
        ]
      },
      {
        id: "refuse-1-q2",
        type: "choose-response",
        prompt: "How can you politely tell Jamie you don't want to play?",
        hint: "A polite refusal is clear but friendly.",
        options: [
          {
            id: "opt1",
            text: "'No way, monster tag is for babies!'",
            isAccepted: false,
            feedback: "This insults the game Jamie likes, which might hurt their feelings."
          },
          {
            id: "opt2",
            text: "'No thanks, Jamie. I really want to finish my comic right now.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You said 'no thanks' clearly and gave a simple, honest reason."
          },
          {
            id: "opt3",
            text: "'Maybe later, thanks for asking!'",
            isAccepted: true,
            feedback: "This is a great, polite way to decline while keeping the door open for later."
          }
        ]
      },
      {
        id: "refuse-1-q3",
        type: "notice-signal",
        prompt: "Jamie looks a little disappointed and says, 'Aww, okay.' Why did you thank them for asking?",
        hint: "Think about how it feels to be invited to something.",
        options: [
          {
            id: "opt1",
            text: "To make them feel silly.",
            isAccepted: false,
            feedback: "We want to make our friends feel good, not silly."
          },
          {
            id: "opt2",
            text: "Because it shows I appreciate that they thought of me and wanted to include me.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on! Thanking them softens the 'no' and shows you are glad they invited you."
          },
          {
            id: "opt3",
            text: "Because it is a strict rule.",
            isAccepted: false,
            feedback: "It's a guideline, but the real reason is because it makes the other person feel valued."
          }
        ]
      },
      {
        id: "refuse-1-q4",
        type: "repair",
        prompt: "Imagine instead you yelled, 'Go away!' and Jamie looked sad. How could you fix that mistake?",
        hint: "We all make mistakes. A good repair involves taking back the mean words.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Sorry! I didn't mean to yell. I just really want to read right now.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Great repair. You apologized for the yell and explained your feelings calmly."
          },
          {
            id: "opt2",
            text: "Ignore them and keep reading.",
            isAccepted: false,
            feedback: "Ignoring them will likely make Jamie feel worse."
          },
          {
            id: "opt3",
            text: "Tell them they were being too loud.",
            isAccepted: false,
            feedback: "Blaming them for your reaction isn't a good way to repair the situation."
          }
        ]
      },
      {
        id: "refuse-1-q5",
        type: "transfer",
        prompt: "What if a different friend asks you to share your snack, but you are still hungry? How can you say no politely?",
        hint: "You can use the same friendly but clear tone.",
        options: [
          {
            id: "opt1",
            text: "'No, get your own snack!'",
            isAccepted: false,
            feedback: "This sounds angry. We can say no kindly."
          },
          {
            id: "opt2",
            text: "'I'm sorry, I'm really hungry today so I need to eat it all.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect. You were polite, said sorry, and gave a clear reason."
          },
          {
            id: "opt3",
            text: "'Maybe tomorrow.'",
            isAccepted: true,
            feedback: "This works if you actually plan to share tomorrow, but it's okay to just say you are hungry today."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "It's always okay to say no! Using 'No thank you' or giving a short reason keeps your boundaries strong while being kind.",
      realLifePractice: "Practice saying 'No thanks' politely the next time someone offers you something you don't want."
    }
  },
  {
    id: "refuse-2",
    familyId: "polite-refusing",
    title: "Declining a Playdate Idea",
    ageRange: "7-8",
    skillName: "Polite Refusing",
    situation: {
      setting: "Your bedroom during a playdate",
      characters: [
        { name: "Alex", description: "Your friend who is visiting" }
      ],
      introduction: "Alex is over for a playdate. You are both building with blocks. Alex says, 'Let's smash all the blocks and pretend there's an earthquake!'"
    },
    questions: [
      {
        id: "refuse-2-q1",
        type: "understand",
        prompt: "You worked really hard on your block tower and you don't want to smash it. How do you feel?",
        hint: "Your feelings about your hard work matter.",
        options: [
          {
            id: "opt1",
            text: "I feel like I have to smash it because Alex is the guest.",
            isAccepted: false,
            feedback: "Guests are important, but your feelings and your hard work matter too!"
          },
          {
            id: "opt2",
            text: "I feel protective of my tower and I don't want it broken.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! It is perfectly normal to not want your hard work destroyed."
          },
          {
            id: "opt3",
            text: "I feel angry that Alex even asked.",
            isAccepted: false,
            feedback: "Alex probably just thought it would be fun; they didn't mean to make you angry."
          }
        ]
      },
      {
        id: "refuse-2-q2",
        type: "choose-response",
        prompt: "How can you tell Alex you don't want to smash the tower?",
        hint: "Be honest but gentle.",
        options: [
          {
            id: "opt1",
            text: "'No! Don't touch it!'",
            isAccepted: true,
            feedback: "This protects your tower, but it might startle Alex. A calmer voice works better."
          },
          {
            id: "opt2",
            text: "'I worked really hard on this tower, so I don't want to smash it. Let's build a new one to smash!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! You politely said no, explained why, and offered a fun compromise."
          },
          {
            id: "opt3",
            text: "Just sit in front of the tower and glare at them.",
            isAccepted: false,
            feedback: "Using words helps Alex understand why you don't want to smash it."
          }
        ]
      },
      {
        id: "refuse-2-q3",
        type: "notice-signal",
        prompt: "Alex pauses and says, 'Oh, okay. Yeah, it is a really cool tower.' What does this tell you?",
        hint: "Did Alex understand your feelings?",
        options: [
          {
            id: "opt1",
            text: "Alex is secretly mad at me.",
            isAccepted: false,
            feedback: "Alex agreed with you and gave you a compliment. They aren't mad!"
          },
          {
            id: "opt2",
            text: "Alex understands and respects my choice.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Because you explained clearly, Alex understood and respected your boundary."
          },
          {
            id: "opt3",
            text: "Alex is going to smash it anyway.",
            isAccepted: false,
            feedback: "Their words show they agree with keeping it safe."
          }
        ]
      },
      {
        id: "refuse-2-q4",
        type: "repair",
        prompt: "What if Alex accidentally bumps the tower and it falls, and you yell, 'I told you no!' but Alex looks like they are going to cry? How can you fix it?",
        hint: "Accidents happen. How do we handle them?",
        options: [
          {
            id: "opt1",
            text: "Say, 'I know it was an accident. I was just surprised. Let's rebuild it together.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You acknowledged it was an accident and focused on a solution."
          },
          {
            id: "opt2",
            text: "Tell them to go home.",
            isAccepted: false,
            feedback: "Sending a guest home over an accident is an overreaction."
          },
          {
            id: "opt3",
            text: "Cry too.",
            isAccepted: false,
            feedback: "It's okay to feel sad, but talking about it helps fix the problem better."
          }
        ]
      },
      {
        id: "refuse-2-q5",
        type: "transfer",
        prompt: "If your sibling wants to borrow your favorite toy, but you are playing with it, how can you politely refuse?",
        hint: "Use the same strategy: say no gently and offer a solution.",
        options: [
          {
            id: "opt1",
            text: "'I'm using it right now, but you can have it in ten minutes.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! This is a clear refusal with a built-in compromise."
          },
          {
            id: "opt2",
            text: "'No, it's mine!'",
            isAccepted: false,
            feedback: "While true, this isn't the most polite or helpful way to say it."
          },
          {
            id: "opt3",
            text: "Hand it over anyway so they don't cry.",
            isAccepted: false,
            feedback: "You don't have to give up something you are actively playing with."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Saying no is much easier when you offer a compromise. It protects your boundaries while keeping the fun going!",
      realLifePractice: "Think of a time you didn't want to do something. Practice saying, 'I don't want to do that, but how about we do [something else] instead?'"
    }
  },
  {
    id: "refuse-3",
    familyId: "polite-refusing",
    title: "Refusing a Treat",
    ageRange: "7-8",
    skillName: "Polite Refusing",
    situation: {
      setting: "A neighbor's house",
      characters: [
        { name: "Mrs. Gable", description: "Your friendly neighbor" }
      ],
      introduction: "You are visiting Mrs. Gable with your parents. She brings out a plate of cookies and says, 'I made these just for you! Try one, it has raisins.'"
    },
    questions: [
      {
        id: "refuse-3-q1",
        type: "understand",
        prompt: "You really don't like raisins. You feel nervous because she made them 'just for you'. What is true about this situation?",
        hint: "Think about whether you are forced to eat things you don't like.",
        options: [
          {
            id: "opt1",
            text: "I have to eat it or she will be angry.",
            isAccepted: false,
            feedback: "Adults shouldn't force you to eat something you don't like, and polite adults won't be angry."
          },
          {
            id: "opt2",
            text: "It is okay to politely decline food I don't like, even if someone made it.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes. You control what goes into your body, and you can say no politely."
          },
          {
            id: "opt3",
            text: "I should hide the cookie in my pocket.",
            isAccepted: false,
            feedback: "Hiding food is messy and dishonest. It's better to just say no thanks."
          }
        ]
      },
      {
        id: "refuse-3-q2",
        type: "choose-response",
        prompt: "How can you tell Mrs. Gable you don't want a cookie?",
        hint: "A polite refusal includes a 'thank you'.",
        options: [
          {
            id: "opt1",
            text: "'Ew, I hate raisins!'",
            isAccepted: false,
            feedback: "Saying 'ew' about food someone made will hurt their feelings."
          },
          {
            id: "opt2",
            text: "'No thank you, Mrs. Gable. I don't care for raisins, but they look nice!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Incredibly polite! You said no thanks, gave a polite reason, and added a compliment."
          },
          {
            id: "opt3",
            text: "'I'm full, thanks.'",
            isAccepted: true,
            feedback: "This is polite, but it's a little white lie. Being honest and polite is usually better."
          }
        ]
      },
      {
        id: "refuse-3-q3",
        type: "notice-signal",
        prompt: "Mrs. Gable smiles and says, 'Oh, no problem! Would you like a glass of water instead?' What does her response mean?",
        hint: "How did she react to your refusal?",
        options: [
          {
            id: "opt1",
            text: "She isn't upset; she just wants to be a good host.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! She respected your 'no' and offered something else instead."
          },
          {
            id: "opt2",
            text: "She is trying to trick me.",
            isAccepted: false,
            feedback: "She is just being kind."
          },
          {
            id: "opt3",
            text: "She is mad that I didn't eat the cookie.",
            isAccepted: false,
            feedback: "Her smile and new offer show she is definitely not mad."
          }
        ]
      },
      {
        id: "refuse-3-q4",
        type: "repair",
        prompt: "If you had accidentally said 'Yuck, raisins!' and she looked hurt, how could you repair the situation?",
        hint: "Focus on apologizing for how you said it.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Sorry, I just meant I don't like raisins. Thank you for offering!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect repair. You clarified your meaning and remembered to say thank you."
          },
          {
            id: "opt2",
            text: "Force yourself to eat the cookie.",
            isAccepted: false,
            feedback: "You don't need to punish yourself to fix a small mistake. An apology is enough."
          },
          {
            id: "opt3",
            text: "Tell your parents you want to leave.",
            isAccepted: false,
            feedback: "Running away doesn't solve the problem. Apologizing does."
          }
        ]
      },
      {
        id: "refuse-3-q5",
        type: "transfer",
        prompt: "At a birthday party, someone offers you a piece of cake with frosting you don't like. What can you do?",
        hint: "Apply the same polite refusal skills.",
        options: [
          {
            id: "opt1",
            text: "Take it and throw it in the trash when they aren't looking.",
            isAccepted: false,
            feedback: "This wastes food and is sneaky. Just politely declining is much better."
          },
          {
            id: "opt2",
            text: "'No thank you! I'm just enjoying the party.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Great job! A friendly 'No thank you' works in almost every situation."
          },
          {
            id: "opt3",
            text: "'Can I just have the cake without the frosting?'",
            isAccepted: true,
            feedback: "This is a great, polite request if you still want the cake!"
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Declining food or gifts can feel awkward, but a simple 'No thank you' is always polite and respected.",
      realLifePractice: "Practice saying 'No thank you' in the mirror with a small, polite smile."
    }
  },
  // Family 3: Asking for Help
  {
    id: "help-1",
    familyId: "asking-for-help",
    title: "Stuck on a Math Problem",
    ageRange: "7-8",
    skillName: "Asking for Help",
    situation: {
      setting: "In the classroom during quiet work time",
      characters: [
        { name: "Mr. Thomas", description: "Your teacher" }
      ],
      introduction: "You are working on a math worksheet, but you are completely stuck on question number four. You've tried twice, but the numbers aren't making sense."
    },
    questions: [
      {
        id: "help-1-q1",
        type: "understand",
        prompt: "You feel frustrated. What is the best way to handle this feeling?",
        hint: "Think about what actions actually help solve the problem.",
        options: [
          {
            id: "opt1",
            text: "Crumple up the paper.",
            isAccepted: false,
            feedback: "This might show you are frustrated, but it doesn't help you solve the math problem."
          },
          {
            id: "opt2",
            text: "Take a deep breath and realize it's okay to ask for help.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. Everyone gets stuck sometimes, and teachers are there to help!"
          },
          {
            id: "opt3",
            text: "Just guess the answer.",
            isAccepted: false,
            feedback: "Guessing won't help you learn how to do it for next time."
          }
        ]
      },
      {
        id: "help-1-q2",
        type: "choose-response",
        prompt: "Mr. Thomas is helping another student across the room. What is the best way to get his attention?",
        hint: "Think about classroom rules for getting attention.",
        options: [
          {
            id: "opt1",
            text: "Yell, 'Mr. Thomas, I don't get this!'",
            isAccepted: false,
            feedback: "Yelling disrupts the quiet work time for everyone else."
          },
          {
            id: "opt2",
            text: "Raise your hand quietly and wait for him to see you.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! Raising your hand is the expected, polite way to ask for help in class."
          },
          {
            id: "opt3",
            text: "Walk over and poke his arm.",
            isAccepted: false,
            feedback: "It's better to wait for him to finish helping the other student first."
          }
        ]
      },
      {
        id: "help-1-q3",
        type: "choose-response",
        prompt: "Mr. Thomas comes over and says, 'What can I help you with?' What should you say?",
        hint: "Be specific about what you need help with.",
        options: [
          {
            id: "opt1",
            text: "'I don't understand question number four. Can you show me how to start?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! You told him exactly which question and asked a clear question."
          },
          {
            id: "opt2",
            text: "'I can't do this.'",
            isAccepted: true,
            feedback: "This lets him know you are stuck, but it helps even more if you point to the exact question."
          },
          {
            id: "opt3",
            text: "'Just give me the answer.'",
            isAccepted: false,
            feedback: "Teachers want to help you learn how to do it, not just give you the answer."
          }
        ]
      },
      {
        id: "help-1-q4",
        type: "notice-signal",
        prompt: "Mr. Thomas smiles, points to the paper, and says, 'Let's look at the first step together.' What does this mean?",
        hint: "How is he responding to your request for help?",
        options: [
          {
            id: "opt1",
            text: "He is mad that I didn't know it.",
            isAccepted: false,
            feedback: "His smile shows he is happy to help you."
          },
          {
            id: "opt2",
            text: "He is going to guide me so I can figure it out myself.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Teachers love helping you learn step-by-step."
          },
          {
            id: "opt3",
            text: "He doesn't know the answer either.",
            isAccepted: false,
            feedback: "He knows it, but he wants to help you discover it."
          }
        ]
      },
      {
        id: "help-1-q5",
        type: "transfer",
        prompt: "If you are at home and can't reach a toy on a high shelf, how can you ask a parent for help?",
        hint: "Use the same clear, polite strategy.",
        options: [
          {
            id: "opt1",
            text: "Stand under the shelf and cry.",
            isAccepted: false,
            feedback: "Using your words gets you help much faster."
          },
          {
            id: "opt2",
            text: "'Excuse me, can you please help me reach that toy?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! 'Excuse me' and 'please' are great ways to ask for help at home."
          },
          {
            id: "opt3",
            text: "Climb the wobbly bookcase.",
            isAccepted: false,
            feedback: "That's dangerous! Always ask for help with high things."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Asking for help isn't a sign of weakness; it's a smart way to learn! Being clear and polite gets the best results.",
      realLifePractice: "Today, if you get stuck on anything—even opening a snack—practice saying, 'Can you help me with this please?'"
    }
  },
  {
    id: "help-2",
    familyId: "asking-for-help",
    title: "Losing a Jacket",
    ageRange: "7-8",
    skillName: "Asking for Help",
    situation: {
      setting: "The school hallway after recess",
      characters: [
        { name: "Ms. Green", description: "The school principal" }
      ],
      introduction: "You are walking back to class after recess, but you realize your favorite blue jacket is missing. You've looked everywhere you can think of."
    },
    questions: [
      {
        id: "help-2-q1",
        type: "understand",
        prompt: "You feel panicked because it's your favorite jacket. What is the most helpful thing to do right now?",
        hint: "When you have a big problem, adults can help you solve it.",
        options: [
          {
            id: "opt1",
            text: "Hide in the bathroom.",
            isAccepted: false,
            feedback: "Hiding won't help find the jacket. Seeking an adult is much safer."
          },
          {
            id: "opt2",
            text: "Find a trusted adult, like a teacher or the principal, and tell them.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Trusted adults are exactly the right people to help with lost items."
          },
          {
            id: "opt3",
            text: "Run back outside without permission.",
            isAccepted: false,
            feedback: "Running off can cause a bigger problem because adults won't know where you are."
          }
        ]
      },
      {
        id: "help-2-q2",
        type: "choose-response",
        prompt: "You see Ms. Green in the hallway. How can you ask her for help?",
        hint: "Start with 'Excuse me' and clearly state your problem.",
        options: [
          {
            id: "opt1",
            text: "'Excuse me, Ms. Green. I lost my blue jacket. Can you help me find it?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent! You got her attention politely, explained the problem, and asked for help directly."
          },
          {
            id: "opt2",
            text: "'Where is my jacket?!'",
            isAccepted: false,
            feedback: "She doesn't know where it is yet. It's better to ask her to help you look."
          },
          {
            id: "opt3",
            text: "'I have a problem.'",
            isAccepted: true,
            feedback: "This is a good start, but you'll need to tell her what the problem is next."
          }
        ]
      },
      {
        id: "help-2-q3",
        type: "notice-signal",
        prompt: "Ms. Green stops walking, turns to face you, and says in a calm voice, 'Of course. Let's check the lost and found.' What does her calm voice tell you?",
        hint: "Adults use a calm voice to help us when we feel panicked.",
        options: [
          {
            id: "opt1",
            text: "That it's not a big deal and I shouldn't care.",
            isAccepted: false,
            feedback: "She knows you care, she just wants to help you feel safe and calm."
          },
          {
            id: "opt2",
            text: "That she is taking me seriously and wants to help solve it calmly.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. Her calm voice is a signal that she is there to help and everything will be okay."
          },
          {
            id: "opt3",
            text: "That she is bored.",
            isAccepted: false,
            feedback: "A calm voice usually means someone is trying to be reassuring and helpful."
          }
        ]
      },
      {
        id: "help-2-q4",
        type: "repair",
        prompt: "What if you were so panicked that you interrupted Ms. Green while she was talking to another teacher? How can you fix it?",
        hint: "If you interrupt, a quick apology goes a long way.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Oh, I'm sorry for interrupting. It's an emergency.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Great repair. You apologized and let her know why you needed her right away."
          },
          {
            id: "opt2",
            text: "Just keep talking louder.",
            isAccepted: false,
            feedback: "Talking louder is rude. An apology works much better."
          },
          {
            id: "opt3",
            text: "Run away in embarrassment.",
            isAccepted: false,
            feedback: "It's okay to make a mistake! Just say sorry and ask for the help you need."
          }
        ]
      },
      {
        id: "help-2-q5",
        type: "transfer",
        prompt: "If you lose your library book at home, how can you ask your family for help?",
        hint: "The same steps work: state the problem clearly and ask for help.",
        options: [
          {
            id: "opt1",
            text: "'Who took my book?'",
            isAccepted: false,
            feedback: "Blaming others can start an argument. You probably just misplaced it."
          },
          {
            id: "opt2",
            text: "'I can't find my library book. Can someone help me look?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You stated the problem and invited them to help you solve it as a team."
          },
          {
            id: "opt3",
            text: "Don't tell anyone and hope it turns up.",
            isAccepted: false,
            feedback: "It's much easier to find things when you have extra people helping!"
          }
        ]
      }
    ],
    completion: {
      skillSummary: "When things go missing or you feel overwhelmed, calmly telling an adult 'I need help' is the best way to solve the problem.",
      realLifePractice: "Identify three 'trusted adults' at your school you could ask for help if you ever lose something."
    }
  },
  {
    id: "help-3",
    familyId: "asking-for-help",
    title: "Needing Space",
    ageRange: "7-8",
    skillName: "Asking for Help",
    situation: {
      setting: "A noisy, crowded birthday party",
      characters: [
        { name: "Dad", description: "Your dad, who is talking to another parent" }
      ],
      introduction: "You are at a birthday party. The music is really loud, kids are running around, and you suddenly feel very overwhelmed and need a quiet break."
    },
    questions: [
      {
        id: "help-3-q1",
        type: "understand",
        prompt: "It's okay to feel overwhelmed when things are loud. What is a good way to handle this feeling?",
        hint: "You don't have to stay in a situation that makes you uncomfortable.",
        options: [
          {
            id: "opt1",
            text: "Scream as loud as you can.",
            isAccepted: false,
            feedback: "Screaming will just add to the noise. Asking for help is better."
          },
          {
            id: "opt2",
            text: "Find your dad and ask him to help you take a break.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Parents are there to help you when you feel overwhelmed."
          },
          {
            id: "opt3",
            text: "Hide under a table.",
            isAccepted: true,
            feedback: "This might give you space, but it's better to tell your dad so he knows where you are and can help."
          }
        ]
      },
      {
        id: "help-3-q2",
        type: "choose-response",
        prompt: "You walk up to your dad. He is talking, but you really need help right now. What can you do?",
        hint: "How do you interrupt politely when you really need something?",
        options: [
          {
            id: "opt1",
            text: "Tug his shirt and say, 'Dad, excuse me, I need a break.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect. A gentle physical signal (like a tug) plus 'excuse me' is a great way to interrupt for help."
          },
          {
            id: "opt2",
            text: "Stand there and cry.",
            isAccepted: false,
            feedback: "Using words helps him understand exactly what you need."
          },
          {
            id: "opt3",
            text: "Say, 'Excuse me,' and wait for him to pause.",
            isAccepted: true,
            feedback: "This is very polite, though if you are very overwhelmed, it's okay to be a little more urgent."
          }
        ]
      },
      {
        id: "help-3-q3",
        type: "notice-signal",
        prompt: "Your dad stops talking, crouches down to your level, and looks at your face. What is he doing?",
        hint: "Why do adults crouch down to talk to kids?",
        options: [
          {
            id: "opt1",
            text: "He is checking to see if my face is dirty.",
            isAccepted: false,
            feedback: "He's probably looking to see how you are feeling."
          },
          {
            id: "opt2",
            text: "He is giving me his full attention because he sees I need help.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Getting on your level shows he is listening carefully."
          },
          {
            id: "opt3",
            text: "His legs are tired.",
            isAccepted: false,
            feedback: "Crouching is a way to communicate that he is focused on you."
          }
        ]
      },
      {
        id: "help-3-q4",
        type: "choose-response",
        prompt: "He asks, 'What's wrong, buddy?' How can you explain what you need?",
        hint: "Be honest about the noise and what would help.",
        options: [
          {
            id: "opt1",
            text: "'It's too loud in here. Can we go outside for a minute?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent! You explained the problem and suggested a great solution."
          },
          {
            id: "opt2",
            text: "'I hate this party!'",
            isAccepted: false,
            feedback: "Saying you hate it doesn't tell him how to help you. Focus on what you need (a break)."
          },
          {
            id: "opt3",
            text: "'I don't feel good.'",
            isAccepted: true,
            feedback: "This is okay, but being specific about the noise helps him fix the exact problem."
          }
        ]
      },
      {
        id: "help-3-q5",
        type: "transfer",
        prompt: "If you feel overwhelmed by a noisy classroom at school, who can you ask for a break?",
        hint: "Think about who is in charge of helping you at school.",
        options: [
          {
            id: "opt1",
            text: "Just walk out of the room.",
            isAccepted: false,
            feedback: "You must always ask an adult before leaving the room so they know you are safe."
          },
          {
            id: "opt2",
            text: "Ask your teacher, 'It's very loud. Can I have a quiet break?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on! Teachers are always happy to help you find a quiet spot to reset."
          },
          {
            id: "opt3",
            text: "Ask the student next to you.",
            isAccepted: false,
            feedback: "Your classmates can't give you permission for a break, only a teacher can."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Advocating for yourself and asking for a break is a superpower! Adults are always there to help when things get too loud or overwhelming.",
      realLifePractice: "Think of a quiet place in your house or classroom where you can go if you ever need a break from noise."
    }
  },
  // Family 4: Apologizing and Fixing Mistakes
  {
    id: "apology-1",
    familyId: "apologizing",
    title: "The Accidental Bump",
    ageRange: "7-8",
    skillName: "Apologizing",
    situation: {
      setting: "The school hallway during passing period",
      characters: [
        { name: "Sam", description: "A younger student carrying a tall stack of books" }
      ],
      introduction: "You are walking fast to get to the water fountain before the bell rings. You turn the corner too quickly and accidentally bump right into Sam, knocking his books to the floor."
    },
    questions: [
      {
        id: "apology-1-q1",
        type: "understand",
        prompt: "It was a total accident, you didn't mean to do it! Do you still need to apologize?",
        hint: "Even if we don't mean to cause a problem, our actions still have an effect.",
        options: [
          {
            id: "opt1",
            text: "No, because it wasn't on purpose.",
            isAccepted: false,
            feedback: "Even if it was an accident, Sam's books still fell. An apology helps fix the relationship."
          },
          {
            id: "opt2",
            text: "Yes, because saying sorry shows you care that they were affected, even by accident.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on! We apologize to show we care, not just when we break a rule."
          },
          {
            id: "opt3",
            text: "Only if a teacher saw it happen.",
            isAccepted: false,
            feedback: "We should apologize because it is kind, not just to avoid getting in trouble."
          }
        ]
      },
      {
        id: "apology-1-q2",
        type: "choose-response",
        prompt: "What is the best way to say sorry to Sam in this moment?",
        hint: "A good apology includes what you are sorry for.",
        options: [
          {
            id: "opt1",
            text: "'Sorry!' while running away.",
            isAccepted: false,
            feedback: "Saying it while running away shows you aren't really stopping to make sure he is okay."
          },
          {
            id: "opt2",
            text: "'Oh no, I'm so sorry I bumped into you! I was going too fast.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent! You said sorry, stated what happened, and took responsibility."
          },
          {
            id: "opt3",
            text: "'Watch where you're going!'",
            isAccepted: false,
            feedback: "Blaming Sam will make him feel worse, especially since you were the one going too fast."
          }
        ]
      },
      {
        id: "apology-1-q3",
        type: "repair",
        prompt: "Words are important, but actions help fix the problem. What should you do next?",
        hint: "How can you help fix the mess on the floor?",
        options: [
          {
            id: "opt1",
            text: "Stand there and watch him pick them up.",
            isAccepted: false,
            feedback: "Watching isn't helping. If you knocked them down, you should help pick them up."
          },
          {
            id: "opt2",
            text: "Crouch down and help him pick up all the books.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Helping to fix the physical mess is a huge part of a real apology."
          },
          {
            id: "opt3",
            text: "Tell him to hurry up because the bell is ringing.",
            isAccepted: false,
            feedback: "Rushing him after you caused the accident is unkind."
          }
        ]
      },
      {
        id: "apology-1-q4",
        type: "notice-signal",
        prompt: "Sam looks surprised, but after you help him pick up the books, he smiles and says, 'Thanks, it's okay.' What does this mean?",
        hint: "How did your apology make him feel?",
        options: [
          {
            id: "opt1",
            text: "He is pretending to be nice but is secretly mad.",
            isAccepted: false,
            feedback: "Most people will genuinely forgive an accident if you help clean it up."
          },
          {
            id: "opt2",
            text: "Your apology and your help made him feel better, and the problem is fixed.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! A good apology helps both people feel better and move on."
          },
          {
            id: "opt3",
            text: "He wants to drop the books again.",
            isAccepted: false,
            feedback: "He's just glad the problem is solved."
          }
        ]
      },
      {
        id: "apology-1-q5",
        type: "transfer",
        prompt: "At home, you accidentally step on your sibling's toe. They say, 'Ouch!' What should you do?",
        hint: "Apply the same rules: apologize and check if they are okay.",
        options: [
          {
            id: "opt1",
            text: "Say 'I'm sorry I stepped on your toe, are you okay?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You apologized for the specific action and checked on them."
          },
          {
            id: "opt2",
            text: "Say, 'Well, your foot was in the way!'",
            isAccepted: false,
            feedback: "Blaming them doesn't help. It's better to just say sorry for the accident."
          },
          {
            id: "opt3",
            text: "Say nothing because it was an accident.",
            isAccepted: false,
            feedback: "Accidents still hurt! We always say sorry when we accidentally hurt someone."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "A true apology has two parts: saying 'I'm sorry for [what happened]' and helping to fix the problem.",
      realLifePractice: "Next time you accidentally bump someone or drop something of theirs, practice saying sorry AND helping them fix it."
    }
  },
  {
    id: "apology-2",
    familyId: "apologizing",
    title: "Breaking a Rule",
    ageRange: "7-8",
    skillName: "Apologizing",
    situation: {
      setting: "The living room at home",
      characters: [
        { name: "Mom", description: "Who told you not to throw a ball in the house" }
      ],
      introduction: "Mom told you not to throw the bouncy ball inside, but you did it anyway just once. It bounced wrong and knocked a picture frame off the table. It didn't break, but it made a loud crash."
    },
    questions: [
      {
        id: "apology-2-q1",
        type: "understand",
        prompt: "Mom comes into the room looking upset. Why is she upset?",
        hint: "Think about the rule she gave you earlier.",
        options: [
          {
            id: "opt1",
            text: "Because she hates the bouncy ball.",
            isAccepted: false,
            feedback: "She probably doesn't hate the ball, just the danger of throwing it inside."
          },
          {
            id: "opt2",
            text: "Because you broke a safety rule and could have broken something.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. She is upset because ignoring safety rules can cause damage."
          },
          {
            id: "opt3",
            text: "Because she was trying to sleep.",
            isAccepted: false,
            feedback: "While the noise might have bothered her, the main issue is the broken rule."
          }
        ]
      },
      {
        id: "apology-2-q2",
        type: "choose-response",
        prompt: "What is the most honest thing to say when she asks, 'What happened?'",
        hint: "Honesty is the most important part of an apology when you make a mistake on purpose.",
        options: [
          {
            id: "opt1",
            text: "'The frame just fell on its own!'",
            isAccepted: false,
            feedback: "Lying usually makes the problem much worse when the truth comes out."
          },
          {
            id: "opt2",
            text: "'I threw the ball even though you said not to, and it hit the frame. I'm sorry.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Incredibly brave and honest! Admitting exactly what you did wrong is the best way to apologize."
          },
          {
            id: "opt3",
            text: "'It wasn't my fault, the ball bounced weird!'",
            isAccepted: false,
            feedback: "The ball only bounced because you threw it. Taking responsibility is key."
          }
        ]
      },
      {
        id: "apology-2-q3",
        type: "notice-signal",
        prompt: "Mom takes a deep breath. She says, 'I appreciate you telling the truth. But we have that rule to protect our house.' What is she signaling?",
        hint: "How is she reacting to your honesty?",
        options: [
          {
            id: "opt1",
            text: "She doesn't care that you broke the rule.",
            isAccepted: false,
            feedback: "She still cares about the rule, which is why she reminded you of it."
          },
          {
            id: "opt2",
            text: "She is glad you were honest, even though she is still a bit disappointed about the rule.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on. Adults highly value honesty, even when you have to admit a mistake."
          },
          {
            id: "opt3",
            text: "She is going to throw the ball away.",
            isAccepted: false,
            feedback: "She just wants you to understand why the rule is important."
          }
        ]
      },
      {
        id: "apology-2-q4",
        type: "repair",
        prompt: "How can you show Mom that you really mean your apology?",
        hint: "What action can you take to fix the mess and prevent it from happening again?",
        options: [
          {
            id: "opt1",
            text: "Pick up the frame and put the bouncy ball away in your closet.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect repair! You fixed the physical mess and put the temptation away."
          },
          {
            id: "opt2",
            text: "Tell her you'll never do it again, but keep holding the ball.",
            isAccepted: false,
            feedback: "Actions speak louder than words. Putting the ball away proves you mean it."
          },
          {
            id: "opt3",
            text: "Just go to your room.",
            isAccepted: false,
            feedback: "You need to fix the picture frame first!"
          }
        ]
      },
      {
        id: "apology-2-q5",
        type: "transfer",
        prompt: "At school, the teacher asks who left the markers open to dry out, and you realize it was you. What should you do?",
        hint: "Use the same bravery and honesty.",
        options: [
          {
            id: "opt1",
            text: "Stay quiet so you don't get in trouble.",
            isAccepted: false,
            feedback: "It's always better to be honest. The teacher just wants the problem solved."
          },
          {
            id: "opt2",
            text: "Raise your hand and say, 'I'm sorry, I forgot to put the caps on. I'll go fix them now.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Amazing! You took responsibility, apologized, and offered a solution immediately."
          },
          {
            id: "opt3",
            text: "Point to the person sitting next to you.",
            isAccepted: false,
            feedback: "Lying and blaming someone else is unkind and dishonest."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "It takes courage to admit when you break a rule. Telling the truth and fixing the mess is the fastest way to earn trust back.",
      realLifePractice: "If you make a mistake this week, practice taking a deep breath and telling an adult exactly what happened."
    }
  },
  {
    id: "apology-3",
    familyId: "apologizing",
    title: "The Accidental Ruin",
    ageRange: "7-8",
    skillName: "Apologizing",
    situation: {
      setting: "Art class",
      characters: [
        { name: "Mia", description: "A classmate who painted a beautiful picture" }
      ],
      introduction: "Mia is letting her painting dry. You are walking by with a wet paintbrush and a big drop of blue paint accidentally drips right onto the center of her painting."
    },
    questions: [
      {
        id: "apology-3-q1",
        type: "understand",
        prompt: "Mia gasps and looks like she might cry. Why is she having such a strong reaction?",
        hint: "Think about how it feels when hard work gets messed up.",
        options: [
          {
            id: "opt1",
            text: "She is being dramatic on purpose.",
            isAccepted: false,
            feedback: "She isn't being dramatic; she is genuinely upset."
          },
          {
            id: "opt2",
            text: "She worked hard on her art and is sad that it got changed without her permission.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. When we put effort into something, we care about it a lot."
          },
          {
            id: "opt3",
            text: "She doesn't like blue paint.",
            isAccepted: false,
            feedback: "The color isn't the problem, the accident on her hard work is."
          }
        ]
      },
      {
        id: "apology-3-q2",
        type: "choose-response",
        prompt: "You feel terrible! What should you say first?",
        hint: "Acknowledge what happened right away.",
        options: [
          {
            id: "opt1",
            text: "'It's just a painting, you can make another one!'",
            isAccepted: false,
            feedback: "This dismisses her feelings. It might be 'just a painting' to you, but it matters to her."
          },
          {
            id: "opt2",
            text: "'Oh no, I am so sorry! My brush dripped by accident.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect. You apologized immediately and explained it was an accident."
          },
          {
            id: "opt3",
            text: "'You should have moved it!'",
            isAccepted: false,
            feedback: "Blaming her for your accident will definitely make her more upset."
          }
        ]
      },
      {
        id: "apology-3-q3",
        type: "repair",
        prompt: "Mia says, 'It's ruined!' How can you help repair the situation?",
        hint: "How can you help fix a paint drip?",
        options: [
          {
            id: "opt1",
            text: "Walk away so she can be alone.",
            isAccepted: false,
            feedback: "Walking away leaves her to deal with the problem you caused alone."
          },
          {
            id: "opt2",
            text: "Offer to grab a paper towel to see if you can dab it off, or ask the teacher for help.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Offering a concrete solution (paper towel) or getting adult help is the best repair."
          },
          {
            id: "opt3",
            text: "Paint the rest of her paper blue so it matches.",
            isAccepted: false,
            feedback: "Do not touch her art more! That will make it worse."
          }
        ]
      },
      {
        id: "help-3-q4", // reusing ID pattern
        type: "notice-signal",
        prompt: "Mia dabs it with a paper towel and it leaves a small smudge. She sighs and says, 'I guess I can turn the smudge into a cloud.' What is she doing?",
        hint: "Is she staying mad forever?",
        options: [
          {
            id: "opt1",
            text: "She is finding a creative way to accept the accident and move on.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! She is using flexible thinking to fix the artwork."
          },
          {
            id: "opt2",
            text: "She expects you to paint the cloud.",
            isAccepted: false,
            feedback: "She probably wants to do it herself to make sure it looks how she wants."
          },
          {
            id: "opt3",
            text: "She is still furious with you.",
            isAccepted: false,
            feedback: "Her sigh shows she is bummed, but her words show she is moving on."
          }
        ]
      },
      {
        id: "apology-3-q5",
        type: "transfer",
        prompt: "If you accidentally tear a page in your friend's book while borrowing it, how can you fix it?",
        hint: "Apply the apology and repair steps.",
        options: [
          {
            id: "opt1",
            text: "Close the book and pretend you didn't do it.",
            isAccepted: false,
            feedback: "They will find out eventually and feel betrayed that you hid it."
          },
          {
            id: "opt2",
            text: "Tell them, 'I'm so sorry, I accidentally tore this page. Can I help you tape it?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! Honest apology plus an offer to help repair the damage."
          },
          {
            id: "opt3",
            text: "Throw the book away.",
            isAccepted: false,
            feedback: "Never throw away someone else's property!"
          }
        ]
      }
    ],
    completion: {
      skillSummary: "When we damage someone else's hard work or property, apologizing and helping to fix the mess shows we respect them.",
      realLifePractice: "If you ever break or damage something, practice offering a solution right after you say sorry (e.g., 'I'm sorry, let me get some tape!')."
    }
  },
  // Family 5: Joining a Group
  {
    id: "join-1",
    familyId: "joining-a-group",
    title: "The Soccer Game",
    ageRange: "7-8",
    skillName: "Joining a Group",
    situation: {
      setting: "The school field during recess",
      characters: [
        { name: "Leo and friends", description: "A group of kids playing a casual soccer game" }
      ],
      introduction: "You see some kids kicking a soccer ball around. It looks like a lot of fun and you really want to play."
    },
    questions: [
      {
        id: "join-1-q1",
        type: "understand",
        prompt: "Before you just run onto the field and kick the ball, what should you do?",
        hint: "Think about how the kids already playing might feel if someone interrupts without warning.",
        options: [
          {
            id: "opt1",
            text: "Just jump in! It's a public field.",
            isAccepted: false,
            feedback: "Jumping in without asking can confuse the game and annoy the players."
          },
          {
            id: "opt2",
            text: "Watch for a minute to understand the game, then politely ask to join.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Watching helps you understand the rules, and asking shows respect."
          },
          {
            id: "opt3",
            text: "Wait for them to beg you to play.",
            isAccepted: false,
            feedback: "If you want to play, you have to be brave and ask!"
          }
        ]
      },
      {
        id: "join-1-q2",
        type: "choose-response",
        prompt: "The ball rolls out of bounds near you. This is a great chance! What should you say?",
        hint: "A polite, friendly question works best.",
        options: [
          {
            id: "opt1",
            text: "'Kick it to me, I'm the best!'",
            isAccepted: false,
            feedback: "Bragging might make them not want to play with you."
          },
          {
            id: "opt2",
            text: "Pick it up and say, 'Hey guys, can I play too?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You helped by getting the ball and asked a simple, friendly question."
          },
          {
            id: "opt3",
            text: "'Why didn't you invite me earlier?'",
            isAccepted: false,
            feedback: "This sounds angry. They probably just didn't know you wanted to play!"
          }
        ]
      },
      {
        id: "join-1-q3",
        type: "notice-signal",
        prompt: "Leo says, 'Sure! We are tied 2-2. You can be on the Blue team.' What is the next step?",
        hint: "How do you fit into their game now?",
        options: [
          {
            id: "opt1",
            text: "Say, 'Thanks!' and join the Blue team, following their rules.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Accepting their setup is the best way to smoothly join the fun."
          },
          {
            id: "opt2",
            text: "Demand to be on the Red team.",
            isAccepted: false,
            feedback: "Arguing about teams right after they let you join might cause conflict."
          },
          {
            id: "opt3",
            text: "Say, 'Actually, let's play tag instead.'",
            isAccepted: false,
            feedback: "They were already playing soccer. If you ask to join, you should play what they are playing."
          }
        ]
      },
      {
        id: "join-1-q4",
        type: "repair",
        prompt: "What if Leo said, 'Sorry, we already have exact even teams and we are almost done.' How should you handle feeling disappointed?",
        hint: "It's okay to feel sad, but how should you react externally?",
        options: [
          {
            id: "opt1",
            text: "Kick the ball over the fence in anger.",
            isAccepted: false,
            feedback: "This is aggressive and will make them definitely not want to play with you tomorrow."
          },
          {
            id: "opt2",
            text: "Say, 'Oh, okay. Maybe next time!' and go find something else to do.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent emotional control! It's okay to be bummed, but reacting calmly leaves the door open for tomorrow."
          },
          {
            id: "opt3",
            text: "Stand in the middle of the field and refuse to move.",
            isAccepted: false,
            feedback: "This ruins the game for everyone and isn't fair to them."
          }
        ]
      },
      {
        id: "join-1-q5",
        type: "transfer",
        prompt: "You see kids playing a board game in the classroom. How do you ask to join?",
        hint: "Use the same observation and asking skills.",
        options: [
          {
            id: "opt1",
            text: "Grab a game piece and start moving it.",
            isAccepted: false,
            feedback: "Don't touch their game without permission!"
          },
          {
            id: "opt2",
            text: "Watch for a moment, then ask, 'Can I get in on the next game?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! Board games are hard to join mid-way, so asking to join the *next* round is very smart."
          },
          {
            id: "opt3",
            text: "Tell the teacher they won't let you play.",
            isAccepted: false,
            feedback: "You haven't even asked them yet! Try asking first."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Joining a group goes smoothly when you watch for a minute, wait for a pause, and politely ask to play.",
      realLifePractice: "Next time you see a group playing a game, practice watching for one full minute to figure out the rules before asking to join."
    }
  },
  {
    id: "join-2",
    familyId: "joining-a-group",
    title: "Building Forts",
    ageRange: "7-8",
    skillName: "Joining a Group",
    situation: {
      setting: "The after-school program",
      characters: [
        { name: "Maya and Ben", description: "Building a fort with cushions" }
      ],
      introduction: "Maya and Ben are having a great time building a huge fort out of couch cushions and blankets. You have some spare blankets you could bring."
    },
    questions: [
      {
        id: "join-2-q1",
        type: "understand",
        prompt: "Why is bringing the spare blankets a good idea if you want to join?",
        hint: "Think about what makes someone a good addition to a team.",
        options: [
          {
            id: "opt1",
            text: "It proves I am better at fort building than them.",
            isAccepted: false,
            feedback: "It's not a competition, it's about cooperation."
          },
          {
            id: "opt2",
            text: "Offering something helpful is a friendly way to show you want to contribute to their game.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Bringing supplies is a great icebreaker and shows you want to help."
          },
          {
            id: "opt3",
            text: "So I can take over and make them use my blankets.",
            isAccepted: false,
            feedback: "You want to join *their* fort, not take it over."
          }
        ]
      },
      {
        id: "join-2-q2",
        type: "choose-response",
        prompt: "You walk over with the blankets. What should you say?",
        hint: "Offer the blankets and ask to join in one sentence.",
        options: [
          {
            id: "opt1",
            text: "'I have blankets, so I am playing now.'",
            isAccepted: false,
            feedback: "This sounds bossy. You still need to ask permission to join their project."
          },
          {
            id: "opt2",
            text: "'Hey, your fort looks awesome! I brought extra blankets, can I help build?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! You gave a compliment, offered help, and asked politely."
          },
          {
            id: "opt3",
            text: "Just throw the blankets on the fort silently.",
            isAccepted: false,
            feedback: "They might think you are trying to mess up the fort. Always use your words!"
          }
        ]
      },
      {
        id: "join-2-q3",
        type: "notice-signal",
        prompt: "Ben says, 'Whoa, yes! We need a roof. Grab that corner!' What does his instruction mean?",
        hint: "Is he accepting you into the game?",
        options: [
          {
            id: "opt1",
            text: "He is bossing me around and being mean.",
            isAccepted: false,
            feedback: "Giving you a job means he is excitedly welcoming you to the team."
          },
          {
            id: "opt2",
            text: "He accepted my offer and is giving me a role in the project.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Giving you a task is his way of saying 'Welcome to the team!'"
          },
          {
            id: "opt3",
            text: "He wants to steal my blanket.",
            isAccepted: false,
            feedback: "He wants to build *with* you!"
          }
        ]
      },
      {
        id: "join-2-q4",
        type: "repair",
        prompt: "While pulling the blanket, you accidentally knock over a cushion wall. Maya looks annoyed. What do you do?",
        hint: "Quick apologies fix accidents.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Oops, my bad! Let me fix it right now.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect repair. A quick apology and immediate action keeps the game fun."
          },
          {
            id: "opt2",
            text: "Blame the cushion for being wobbly.",
            isAccepted: false,
            feedback: "Just take responsibility and fix it. It's much faster!"
          },
          {
            id: "opt3",
            text: "Run away.",
            isAccepted: false,
            feedback: "Don't run away! Just help rebuild the wall."
          }
        ]
      },
      {
        id: "join-2-q5",
        type: "transfer",
        prompt: "Some kids are drawing a giant chalk city on the sidewalk. How can you ask to join?",
        hint: "Use a compliment and an offer to help.",
        options: [
          {
            id: "opt1",
            text: "Start drawing a monster truck in the middle of their city.",
            isAccepted: false,
            feedback: "You might ruin what they were drawing. Ask first!"
          },
          {
            id: "opt2",
            text: "'Wow, cool city! Do you guys need someone to draw a park or a fire station?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Amazing! A compliment and offering a specific, helpful idea is a great way to join."
          },
          {
            id: "opt3",
            text: "'Can I have some chalk?'",
            isAccepted: true,
            feedback: "This is okay, but asking if you can help *them* draw is even better."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Giving a compliment or offering something helpful (like a tool or an idea) makes it really easy and fun for groups to say 'Yes!' when you ask to join.",
      realLifePractice: "Practice offering a compliment first next time you ask to play (e.g., 'That looks so fun, can I play?')."
    }
  },
  // Family 6: Dealing with Losing
  {
    id: "losing-1",
    familyId: "dealing-with-losing",
    title: "The Board Game",
    ageRange: "7-8",
    skillName: "Dealing with Losing",
    situation: {
      setting: "The living room floor",
      characters: [
        { name: "Your sibling", description: "Who just drew the winning card" }
      ],
      introduction: "You are playing Candyland with your sibling. You were in the lead the whole time, but on the very last turn, they drew the Queen Frostine card and won the game instantly."
    },
    questions: [
      {
        id: "losing-1-q1",
        type: "understand",
        prompt: "You feel your face get hot and you want to yell. Why is it normal to feel upset right now?",
        hint: "Think about how it feels when a game changes suddenly.",
        options: [
          {
            id: "opt1",
            text: "Because my sibling cheated.",
            isAccepted: false,
            feedback: "Drawing a lucky card isn't cheating; it's just how the game works."
          },
          {
            id: "opt2",
            text: "Because it's disappointing to be so close to winning and then lose by chance.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. It is totally normal to feel disappointed! The trick is how we handle that feeling."
          },
          {
            id: "opt3",
            text: "Because Candyland is a bad game.",
            isAccepted: false,
            feedback: "It's a game of luck. Feeling upset comes from the disappointment of losing, not the game itself."
          }
        ]
      },
      {
        id: "losing-1-q2",
        type: "choose-response",
        prompt: "You are very disappointed. What is the best way to handle the end of the game?",
        hint: "What does a good sport do?",
        options: [
          {
            id: "opt1",
            text: "Flip the board over.",
            isAccepted: false,
            feedback: "Flipping the board ruins the game and will probably result in a punishment."
          },
          {
            id: "opt2",
            text: "Take a deep breath and say, 'Wow, lucky card! Good game.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! A deep breath helps your body calm down, and saying 'Good game' shows great sportsmanship."
          },
          {
            id: "opt3",
            text: "Cry loudly.",
            isAccepted: false,
            feedback: "If you feel tears coming, it's better to take a deep breath or ask for a moment alone to calm down."
          }
        ]
      },
      {
        id: "losing-1-q3",
        type: "notice-signal",
        prompt: "Your sibling smiles and says, 'Thanks! Do you want to play again? I'll let you go first.' Why did they offer this?",
        hint: "How did your good sportsmanship affect them?",
        options: [
          {
            id: "opt1",
            text: "They feel sorry for me.",
            isAccepted: false,
            feedback: "They are offering because you were fun to play with."
          },
          {
            id: "opt2",
            text: "Because I was a good sport, they enjoyed playing with me and want to keep having fun.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! When you are a good sport, people want to keep playing with you."
          },
          {
            id: "opt3",
            text: "They want to beat me again.",
            isAccepted: false,
            feedback: "They likely just want to keep having fun together."
          }
        ]
      },
      {
        id: "losing-1-q4",
        type: "repair",
        prompt: "What if you had yelled, 'That's not fair!' and your sibling looked sad. How could you repair the moment?",
        hint: "You can always fix a poor reaction with a quick apology.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Sorry I yelled. I was just frustrated because I almost won. Good game.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You explained your feelings calmly and added 'Good game' to fix it."
          },
          {
            id: "opt2",
            text: "Storm out of the room.",
            isAccepted: false,
            feedback: "Storming out leaves the problem unfixed."
          },
          {
            id: "opt3",
            text: "Tell them to put the game away.",
            isAccepted: false,
            feedback: "Bossing them around doesn't repair the yelling."
          }
        ]
      },
      {
        id: "losing-1-q5",
        type: "transfer",
        prompt: "You are playing a video game with a friend and they beat your high score. What should you say?",
        hint: "Use the same 'Good Game' attitude.",
        options: [
          {
            id: "opt1",
            text: "'The controller is broken!'",
            isAccepted: false,
            feedback: "Making excuses isn't showing good sportsmanship."
          },
          {
            id: "opt2",
            text: "'Whoa, nice job! You are really good at this.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Amazing! Complimenting their skill is the ultimate good sportsmanship."
          },
          {
            id: "opt3",
            text: "Turn off the console.",
            isAccepted: false,
            feedback: "Turning it off ruins the fun. Be a good sport instead!"
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Losing can feel really frustrating! Taking a deep breath and saying 'Good game' proves you are a mature, fun player.",
      realLifePractice: "Next time you play any game, practice saying 'Good game' at the end, whether you win or lose."
    }
  },
  {
    id: "losing-2",
    familyId: "dealing-with-losing",
    title: "The Racing Game",
    ageRange: "7-8",
    skillName: "Dealing with Losing",
    situation: {
      setting: "P.E. class in the gym",
      characters: [
        { name: "Jordan", description: "A very fast runner in your class" }
      ],
      introduction: "Your P.E. teacher sets up a relay race. Your team tries really hard, but Jordan's team wins the race by a few seconds."
    },
    questions: [
      {
        id: "losing-2-q1",
        type: "understand",
        prompt: "Your teammate groans and says, 'We lost because you ran too slow.' How does that make you feel, and is it a fair thing to say?",
        hint: "Think about team sports and sportsmanship.",
        options: [
          {
            id: "opt1",
            text: "It makes me feel bad, and it is not fair because teams win and lose together.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. Blaming one person is poor sportsmanship. A team is a team!"
          },
          {
            id: "opt2",
            text: "It's fair, I should have run faster.",
            isAccepted: false,
            feedback: "Everyone runs at different speeds. You tried your best, and that's what matters."
          },
          {
            id: "opt3",
            text: "It means I should quit P.E.",
            isAccepted: false,
            feedback: "Never quit just because someone was unkind! P.E. is about exercise and fun."
          }
        ]
      },
      {
        id: "losing-2-q2",
        type: "choose-response",
        prompt: "The race is over. Jordan's team is cheering. What is the expected, polite thing for your team to do?",
        hint: "What do professional athletes do at the end of a game?",
        options: [
          {
            id: "opt1",
            text: "Walk away and ignore them.",
            isAccepted: false,
            feedback: "Ignoring them isn't very polite. Sportsmanship means acknowledging the other team."
          },
          {
            id: "opt2",
            text: "High-five Jordan's team and say 'Good race!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! High-fives or fist bumps are the universal sign of good sportsmanship."
          },
          {
            id: "opt3",
            text: "Boo them loudly.",
            isAccepted: false,
            feedback: "Booing is very rude and will likely get you in trouble with the teacher."
          }
        ]
      },
      {
        id: "losing-2-q3",
        type: "notice-signal",
        prompt: "Jordan high-fives you back and says, 'You guys were right behind us, that was close!' What does this show?",
        hint: "How is Jordan acting as a winner?",
        options: [
          {
            id: "opt1",
            text: "Jordan is bragging.",
            isAccepted: false,
            feedback: "Saying it was close is actually a compliment to your team."
          },
          {
            id: "opt2",
            text: "Jordan is being a 'good winner' by complimenting how hard you tried.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Being a good sport applies to winning, too. Jordan is being kind."
          },
          {
            id: "opt3",
            text: "Jordan is lying.",
            isAccepted: false,
            feedback: "Jordan probably means it. It *was* a close race!"
          }
        ]
      },
      {
        id: "losing-2-q4",
        type: "repair",
        prompt: "What if you were so mad you refused to high-five anyone and sat on the floor with your arms crossed? How could you fix it when you calm down?",
        hint: "You can apologize to the teacher or the players.",
        options: [
          {
            id: "opt1",
            text: "Go up to Jordan later and say, 'Sorry I was grumpy. Good job on the race.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. It's never too late to show good sportsmanship."
          },
          {
            id: "opt2",
            text: "Pretend it never happened.",
            isAccepted: false,
            feedback: "People will remember you were grumpy. An apology clears the air."
          },
          {
            id: "opt3",
            text: "Tell the teacher your leg hurt.",
            isAccepted: false,
            feedback: "Making excuses is dishonest. Admitting you were frustrated is much braver."
          }
        ]
      },
      {
        id: "losing-2-q5",
        type: "transfer",
        prompt: "You lose a game of musical chairs. What is the best way to walk away?",
        hint: "Keep your head up and use positive words.",
        options: [
          {
            id: "opt1",
            text: "Kick a chair.",
            isAccepted: false,
            feedback: "This is unsafe and aggressive."
          },
          {
            id: "opt2",
            text: "Smile, say 'Ah, man!', and go sit with the other kids who are 'out' to watch the rest of the game.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You accepted the loss gracefully and joined the audience to cheer on the rest."
          },
          {
            id: "opt3",
            text: "Argue that the music stopped too fast.",
            isAccepted: false,
            feedback: "Arguing with the person running the game isn't fair. Just accept the result!"
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Losing as a team means you support your teammates and congratulate the winners. It keeps the game fun for next time!",
      realLifePractice: "When you play a physical game like tag or a race, practice high-fiving the winner."
    }
  },
  // Family 7: Winning Gracefully
  {
    id: "winning-1",
    familyId: "winning-gracefully",
    title: "Winning the Spelling Bee",
    ageRange: "7-8",
    skillName: "Winning Gracefully",
    situation: {
      setting: "The classroom",
      characters: [
        { name: "Toby", description: "The classmate who came in second place" }
      ],
      introduction: "You just won the class spelling bee! You spelled the final word perfectly, and Toby missed his word."
    },
    questions: [
      {
        id: "winning-1-q1",
        type: "understand",
        prompt: "You feel amazing because you won! How is Toby probably feeling right now?",
        hint: "Think about how it feels to come in second place.",
        options: [
          {
            id: "opt1",
            text: "He is probably just as happy as I am.",
            isAccepted: false,
            feedback: "He is likely disappointed that he missed the word."
          },
          {
            id: "opt2",
            text: "He is probably feeling disappointed that he lost.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. It's important to remember that when we win, someone else is usually feeling sad about losing."
          },
          {
            id: "opt3",
            text: "He is angry at the teacher.",
            isAccepted: false,
            feedback: "He is more likely just sad he missed the word."
          }
        ]
      },
      {
        id: "winning-1-q2",
        type: "choose-response",
        prompt: "You are holding your winner's ribbon. What is the best way to act around Toby?",
        hint: "How can you be proud of yourself without making him feel worse?",
        options: [
          {
            id: "opt1",
            text: "Wave the ribbon in his face and say 'I'm the champion!'",
            isAccepted: false,
            feedback: "This is called bragging or 'rubbing it in,' and it will make Toby feel much worse."
          },
          {
            id: "opt2",
            text: "Smile, say 'Good job, Toby, you were really hard to beat!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You can be happy you won while still complimenting how well he did."
          },
          {
            id: "opt3",
            text: "Hide the ribbon and pretend you didn't win.",
            isAccepted: false,
            feedback: "You don't have to hide your success, just celebrate it kindly."
          }
        ]
      },
      {
        id: "winning-1-q3",
        type: "notice-signal",
        prompt: "Toby smiles a little and says, 'Thanks, you too.' What does his reaction tell you?",
        hint: "Did your compliment help?",
        options: [
          {
            id: "opt1",
            text: "He is pretending to be nice.",
            isAccepted: false,
            feedback: "He is genuinely trying to be a good sport."
          },
          {
            id: "opt2",
            text: "Your compliment helped him feel a bit better and be a good sport.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Being a good winner makes it easier for the other person to be a good loser."
          },
          {
            id: "opt3",
            text: "He wants to spell another word.",
            isAccepted: false,
            feedback: "The competition is over, he is just accepting your compliment."
          }
        ]
      },
      {
        id: "winning-1-q4",
        type: "repair",
        prompt: "What if you had done a victory dance right in front of him, and he started crying? How could you repair it?",
        hint: "If you brag too much, an apology is needed.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Sorry, I was just really excited. You did a great job.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You explained your excitement without making an excuse, and offered a compliment."
          },
          {
            id: "opt2",
            text: "Tell him babies cry.",
            isAccepted: false,
            feedback: "Calling names is bullying, not a repair."
          },
          {
            id: "opt3",
            text: "Give him your ribbon.",
            isAccepted: false,
            feedback: "You earned the ribbon! You just need to apologize for showing off too much."
          }
        ]
      },
      {
        id: "winning-1-q5",
        type: "transfer",
        prompt: "You win a game of Connect 4 against your sister. How do you win gracefully?",
        hint: "What words show good sportsmanship?",
        options: [
          {
            id: "opt1",
            text: "'In your face!'",
            isAccepted: false,
            feedback: "This is bragging."
          },
          {
            id: "opt2",
            text: "'Good game! Want to play again?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on! 'Good game' is the perfect thing to say when you win."
          },
          {
            id: "opt3",
            text: "Just walk away in silence.",
            isAccepted: false,
            feedback: "Saying 'good game' is much more polite than walking away."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Winning feels great, but a true champion remembers to be kind to the people who didn't win.",
      realLifePractice: "When you win a game, practice saying 'Good game, you played really well' instead of bragging."
    }
  },
  // Family 8: Taking Turns
  {
    id: "turns-1",
    familyId: "taking-turns",
    title: "The Tablet Timer",
    ageRange: "7-8",
    skillName: "Taking Turns",
    situation: {
      setting: "The living room",
      characters: [
        { name: "Your sibling", description: "Waiting to play their favorite game" }
      ],
      introduction: "You are playing a super fun game on the tablet. The timer goes off, meaning it's your sibling's turn, but you are right in the middle of a level."
    },
    questions: [
      {
        id: "turns-1-q1",
        type: "understand",
        prompt: "You feel stressed because you want to finish the level. Why is it important to respect the timer anyway?",
        hint: "Think about fairness and trust.",
        options: [
          {
            id: "opt1",
            text: "Because the tablet will break if I keep playing.",
            isAccepted: false,
            feedback: "The tablet is fine, the issue is fairness."
          },
          {
            id: "opt2",
            text: "Because sharing fairly builds trust, and your sibling has been waiting patiently.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! When you respect the timer, they will respect it when it's your turn next."
          },
          {
            id: "opt3",
            text: "It isn't important, they can wait.",
            isAccepted: false,
            feedback: "Making them wait when the timer is done is unfair."
          }
        ]
      },
      {
        id: "turns-1-q2",
        type: "choose-response",
        prompt: "What is the best thing to do right now?",
        hint: "How can you transition the turn smoothly?",
        options: [
          {
            id: "opt1",
            text: "Pause the game, hand the tablet over, and say, 'Here you go, it's your turn.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You paused it so you won't lose your spot, and handed it over politely."
          },
          {
            id: "opt2",
            text: "Yell, 'Just one more minute!' and keep playing.",
            isAccepted: false,
            feedback: "This breaks the rule of the timer and will cause an argument."
          },
          {
            id: "opt3",
            text: "Throw the tablet on the couch and storm off.",
            isAccepted: false,
            feedback: "This shows poor emotional control. Handing it over gently is much better."
          }
        ]
      },
      {
        id: "turns-1-q3",
        type: "notice-signal",
        prompt: "Your sibling takes the tablet, smiles, and says, 'Thanks! I'll tell you when your turn is up.' What does their smile mean?",
        hint: "How did your fairness affect them?",
        options: [
          {
            id: "opt1",
            text: "They are happy you shared fairly and they feel respected.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Fairness makes everyone feel good and keeps the peace in the house."
          },
          {
            id: "opt2",
            text: "They are plotting to delete your game.",
            isAccepted: false,
            feedback: "They are just happy it is their turn."
          },
          {
            id: "opt3",
            text: "They are making fun of you.",
            isAccepted: false,
            feedback: "Their 'thanks' shows they appreciate you following the rules."
          }
        ]
      },
      {
        id: "turns-1-q4",
        type: "repair",
        prompt: "What if you had refused to hand it over, and your sibling started crying? How could you fix it?",
        hint: "Handing it over is the first step.",
        options: [
          {
            id: "opt1",
            text: "Hand it over immediately and say, 'Sorry, I got distracted by the game. Your turn.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You stopped the unfair behavior, apologized, and gave them the turn."
          },
          {
            id: "opt2",
            text: "Tell them to stop crying.",
            isAccepted: false,
            feedback: "Telling someone how to feel doesn't fix the problem."
          },
          {
            id: "opt3",
            text: "Give it to them but pull the plug so it dies.",
            isAccepted: false,
            feedback: "This is very mean and will definitely cause a bigger problem!"
          }
        ]
      },
      {
        id: "turns-1-q5",
        type: "transfer",
        prompt: "You are on the swings at the park, and you see another kid waiting. What should you do?",
        hint: "Apply the idea of fairness and sharing.",
        options: [
          {
            id: "opt1",
            text: "Swing as high and as long as you can.",
            isAccepted: false,
            feedback: "It's important to share public equipment."
          },
          {
            id: "opt2",
            text: "Take a few more swings, then safely stop and offer them the swing.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! You finished your turn nicely and gave them a chance to play."
          },
          {
            id: "opt3",
            text: "Jump off while it's moving so they can have it immediately.",
            isAccepted: false,
            feedback: "This is very dangerous! Always stop safely before sharing."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Taking turns can be hard when you are having fun, but following the rules builds trust so people will share with you next time.",
      realLifePractice: "When you share a toy or game today, try to be the first one to say 'It's your turn!' when the time is up."
    }
  },
  // Family 9: Respecting Personal Space
  {
    id: "space-1",
    familyId: "respecting-personal-space",
    title: "The Close Talker",
    ageRange: "7-8",
    skillName: "Respecting Personal Space",
    situation: {
      setting: "In line for the drinking fountain",
      characters: [
        { name: "Eli", description: "The student standing in front of you" }
      ],
      introduction: "You are standing in line. You are so excited to tell Eli about a movie you saw that you step really close, right up against his backpack, while you talk."
    },
    questions: [
      {
        id: "space-1-q1",
        type: "understand",
        prompt: "Why is it important to leave an 'arm's length' of space between you and other people?",
        hint: "Think about how people feel when they don't have enough room.",
        options: [
          {
            id: "opt1",
            text: "Because everyone has a personal space bubble that makes them feel comfortable and safe.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Standing too close can make people feel trapped or nervous."
          },
          {
            id: "opt2",
            text: "So you don't get in trouble.",
            isAccepted: false,
            feedback: "We leave space to be kind and respectful, not just to avoid trouble."
          },
          {
            id: "opt3",
            text: "It isn't important, friends can stand as close as they want.",
            isAccepted: false,
            feedback: "Even friends need personal space sometimes!"
          }
        ]
      },
      {
        id: "space-1-q2",
        type: "notice-signal",
        prompt: "While you are talking, Eli takes a big step backward away from you. What is he communicating without using words?",
        hint: "Pay attention to body language.",
        options: [
          {
            id: "opt1",
            text: "He wants to race me to the fountain.",
            isAccepted: false,
            feedback: "Stepping back is usually a sign someone needs more room."
          },
          {
            id: "opt2",
            text: "He feels too crowded and is trying to make his personal space bigger.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on! When people step back, it's a clear signal they need more space."
          },
          {
            id: "opt3",
            text: "He is doing a dance.",
            isAccepted: false,
            feedback: "It's much more likely he just needs some breathing room."
          }
        ]
      },
      {
        id: "space-1-q3",
        type: "choose-response",
        prompt: "You notice Eli stepped back. What should you do?",
        hint: "How should you adjust your own body?",
        options: [
          {
            id: "opt1",
            text: "Take a step forward to get close again.",
            isAccepted: false,
            feedback: "If you step forward, he will feel crowded again. Respect his step back."
          },
          {
            id: "opt2",
            text: "Stay where you are and keep talking from that new distance.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You let him set the comfortable distance, and you respected it."
          },
          {
            id: "opt3",
            text: "Ask him why he is walking away.",
            isAccepted: false,
            feedback: "He isn't walking away, just creating space. It's best to just stay where you are."
          }
        ]
      },
      {
        id: "space-1-q4",
        type: "repair",
        prompt: "What if you accidentally bumped him with your stomach because you were too close? How can you fix it?",
        hint: "Acknowledge the bump and create space.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Oops, sorry! I'm standing too close,' and take a step back.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You apologized and fixed the spacing problem immediately."
          },
          {
            id: "opt2",
            text: "Pretend it didn't happen.",
            isAccepted: false,
            feedback: "If you bump someone, you should always say sorry."
          },
          {
            id: "opt3",
            text: "Tell him his backpack is too big.",
            isAccepted: false,
            feedback: "Blaming him for you standing too close isn't fair."
          }
        ]
      },
      {
        id: "space-1-q5",
        type: "transfer",
        prompt: "You are sitting on the rug for storytime, and your legs are touching the person next to you. They keep shifting away. What should you do?",
        hint: "Apply the personal space rule to sitting down.",
        options: [
          {
            id: "opt1",
            text: "Tuck your legs in or slide over slightly so you aren't touching them.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! You noticed their body language and gave them the space they needed."
          },
          {
            id: "opt2",
            text: "Stretch your legs out more.",
            isAccepted: false,
            feedback: "This will make them even more uncomfortable."
          },
          {
            id: "opt3",
            text: "Tell the teacher they are moving too much.",
            isAccepted: false,
            feedback: "They are moving because they need space. You can solve it yourself by shifting over."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Everyone has a 'personal space bubble'. If someone steps away from you, it's a polite signal that they just need a little more room to breathe.",
      realLifePractice: "Today, try to imagine a hula hoop around yourself and your friends to help remember how much personal space to leave."
    }
  },
  // Family 10: Compromising
  {
    id: "compromise-1",
    familyId: "compromising",
    title: "Choosing a Movie",
    ageRange: "7-8",
    skillName: "Compromising",
    situation: {
      setting: "The living room on movie night",
      characters: [
        { name: "Your sibling", description: "Who wants to watch a different movie" }
      ],
      introduction: "It is family movie night! You really want to watch the new superhero movie, but your sibling really wants to watch the funny animal movie. You only have time for one."
    },
    questions: [
      {
        id: "compromise-1-q1",
        type: "understand",
        prompt: "Both of you want different things, and both of you feel strongly about it. What is the goal here?",
        hint: "Think about how to make movie night fun for both of you.",
        options: [
          {
            id: "opt1",
            text: "To argue until they give up.",
            isAccepted: false,
            feedback: "Arguing ruins the fun of movie night for everyone."
          },
          {
            id: "opt2",
            text: "To find a solution where both people feel okay, even if they don't get exactly what they want.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! That is called a compromise. It keeps the peace and shares the fun."
          },
          {
            id: "opt3",
            text: "To just go to bed.",
            isAccepted: false,
            feedback: "You don't have to give up entirely. You can work together to solve it."
          }
        ]
      },
      {
        id: "compromise-1-q2",
        type: "choose-response",
        prompt: "How can you suggest a fair compromise?",
        hint: "What is a fair way to decide between two choices?",
        options: [
          {
            id: "opt1",
            text: "Say, 'I'm older, so I pick.'",
            isAccepted: false,
            feedback: "This isn't fair. Age shouldn't dictate who gets to choose."
          },
          {
            id: "opt2",
            text: "Say, 'How about we flip a coin? The winner picks tonight, and the other person picks next week.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! You offered a fair way to decide tonight AND guaranteed the other person gets a turn later."
          },
          {
            id: "opt3",
            text: "Say, 'If we don't watch mine, I'm not watching anything.'",
            isAccepted: false,
            feedback: "This is giving an ultimatum, not a compromise."
          }
        ]
      },
      {
        id: "compromise-1-q3",
        type: "notice-signal",
        prompt: "Your sibling agrees, you flip the coin, and they win. They say, 'Yay! Animal movie!' What is the polite way to handle losing the toss?",
        hint: "You agreed to the flip, so how do you accept the result?",
        options: [
          {
            id: "opt1",
            text: "Complain that the coin flip was rigged.",
            isAccepted: false,
            feedback: "If you agree to a coin flip, you have to accept the result fairly."
          },
          {
            id: "opt2",
            text: "Say, 'Okay, animal movie it is. Next week is superhero time!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You accepted the result gracefully and reminded them of the deal for next week."
          },
          {
            id: "opt3",
            text: "Leave the room.",
            isAccepted: false,
            feedback: "You can still enjoy spending time together, even if it wasn't your first choice of movie."
          }
        ]
      },
      {
        id: "compromise-1-q4",
        type: "repair",
        prompt: "What if, before the coin flip, you yelled, 'Your movie is stupid!' How can you repair that before compromising?",
        hint: "You have to take back the mean words before you can make a deal.",
        options: [
          {
            id: "opt1",
            text: "Say, 'Sorry, I shouldn't have called it stupid. I just really wanted my movie. Let's make a deal.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You apologized for the insult and then moved on to the compromise."
          },
          {
            id: "opt2",
            text: "Say, 'Fine, let's just flip a coin.'",
            isAccepted: false,
            feedback: "You need to apologize for the insult first, or they might still be mad."
          },
          {
            id: "opt3",
            text: "Keep saying it's stupid.",
            isAccepted: false,
            feedback: "Continuing to insult their choice will just make the fight worse."
          }
        ]
      },
      {
        id: "compromise-1-q5",
        type: "transfer",
        prompt: "You and a friend are playing with blocks. You want to build a castle, they want to build a spaceship. What is a good compromise?",
        hint: "How can you combine both ideas?",
        options: [
          {
            id: "opt1",
            text: "Hide the blocks.",
            isAccepted: false,
            feedback: "This ruins the fun for both of you."
          },
          {
            id: "opt2",
            text: "'How about we build a space-castle? Half castle, half spaceship!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Amazing! Combining ideas is one of the best and most creative ways to compromise."
          },
          {
            id: "opt3",
            text: "Just build your castle and ignore them.",
            isAccepted: false,
            feedback: "Playing together means listening to each other's ideas."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Compromising means finding a way for everyone to be okay with a decision. Flipping a coin, taking turns, or combining ideas are great strategies!",
      realLifePractice: "Next time you and a friend can't agree on what to play, try saying 'Let's combine our ideas!'"
    }
  },
  // Family 11: Being Flexible
  {
    id: "flexible-1",
    familyId: "being-flexible",
    title: "Rain on Beach Day",
    ageRange: "7-8",
    skillName: "Being Flexible",
    situation: {
      setting: "Looking out the window at home",
      characters: [
        { name: "Dad", description: "Who promised to take you to the beach today" }
      ],
      introduction: "You have been excited all week for Beach Day today. But when you wake up, it is pouring rain and thundering outside. Dad says, 'I'm sorry, we can't go to the beach today.'"
    },
    questions: [
      {
        id: "flexible-1-q1",
        type: "understand",
        prompt: "You feel incredibly disappointed. Is it Dad's fault that the plan changed?",
        hint: "Think about what caused the change.",
        options: [
          {
            id: "opt1",
            text: "Yes, he promised, so he should control the weather.",
            isAccepted: false,
            feedback: "No one can control the weather! It's not his fault."
          },
          {
            id: "opt2",
            text: "No, the weather caused the change, and we have to stay safe.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. Sometimes things change for safety reasons that are out of our control."
          },
          {
            id: "opt3",
            text: "Yes, he just doesn't want to go.",
            isAccepted: false,
            feedback: "He probably wants to go just as much as you do!"
          }
        ]
      },
      {
        id: "flexible-1-q2",
        type: "choose-response",
        prompt: "You are allowed to feel sad, but how should you act?",
        hint: "What is a flexible way to respond to bad news?",
        options: [
          {
            id: "opt1",
            text: "Throw your swimsuit on the floor and yell.",
            isAccepted: false,
            feedback: "Throwing a tantrum won't make it sunny, and it makes everyone else stressed."
          },
          {
            id: "opt2",
            text: "Take a deep breath and say, 'I'm really bummed. Can we do something fun inside instead?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You shared your feelings honestly, but then quickly pivoted to a new plan."
          },
          {
            id: "opt3",
            text: "Go outside in the thunder anyway.",
            isAccepted: false,
            feedback: "Thunder is dangerous! You must follow safety rules."
          }
        ]
      },
      {
        id: "flexible-1-q3",
        type: "notice-signal",
        prompt: "Dad looks relieved and says, 'I'm bummed too. How about we build a giant indoor tent and watch a movie?' What does his reaction mean?",
        hint: "How did your flexibility affect him?",
        options: [
          {
            id: "opt1",
            text: "He is happy you handled the disappointment so well, and now he wants to make the day special anyway.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! When you are flexible, adults love trying to reward you with a different fun activity."
          },
          {
            id: "opt2",
            text: "He planned the rain on purpose to watch a movie.",
            isAccepted: false,
            feedback: "He didn't plan it, he is just being flexible too!"
          },
          {
            id: "opt3",
            text: "He doesn't care that you were sad.",
            isAccepted: false,
            feedback: "He said he was bummed too! He is trying to cheer you both up."
          }
        ]
      },
      {
        id: "flexible-1-q4",
        type: "repair",
        prompt: "If you had yelled at him first and slammed your door, how could you fix it?",
        hint: "Once you calm down, what should you say?",
        options: [
          {
            id: "opt1",
            text: "Stay in your room all day.",
            isAccepted: false,
            feedback: "Staying in your room just ruins your whole day. An apology is better."
          },
          {
            id: "opt2",
            text: "Come out and say, 'Sorry I yelled. I was just really mad at the rain. The tent sounds fun.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You apologized, explained it was the rain you were mad at, and accepted the new plan."
          },
          {
            id: "opt3",
            text: "Tell him you still expect to go to the beach tomorrow.",
            isAccepted: false,
            feedback: "Making demands after throwing a fit isn't a good way to repair."
          }
        ]
      },
      {
        id: "flexible-1-q5",
        type: "transfer",
        prompt: "At school, the teacher says the playground is closed for repairs, so recess will be in the gym. What do you do?",
        hint: "Apply the same flexible thinking.",
        options: [
          {
            id: "opt1",
            text: "Complain the whole time.",
            isAccepted: false,
            feedback: "Complaining won't fix the playground."
          },
          {
            id: "opt2",
            text: "Say, 'Aw, man! Well, let's go play basketball instead!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You acknowledged the disappointment briefly, then immediately found the fun in the new plan."
          },
          {
            id: "opt3",
            text: "Refuse to play in the gym.",
            isAccepted: false,
            feedback: "You'll just be bored! It's better to be flexible and join in."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Being flexible means you can bend without breaking when plans change! It helps you turn a disappointing day into a fun one.",
      realLifePractice: "When a small plan changes today (like what's for dinner), practice saying 'Oh well, that's okay too!'"
    }
  },
  // Family 12: Dealing with Teasing
  {
    id: "teasing-1",
    familyId: "dealing-with-teasing",
    title: "The Shirt Comment",
    ageRange: "7-8",
    skillName: "Dealing with Teasing",
    situation: {
      setting: "The lunchroom at school",
      characters: [
        { name: "A classmate", description: "Who is trying to get a reaction out of you" }
      ],
      introduction: "You are wearing your favorite bright green shirt. A classmate walks by and says, 'Whoa, that shirt is so bright it hurts my eyes! It looks like a giant booger.'"
    },
    questions: [
      {
        id: "teasing-1-q1",
        type: "understand",
        prompt: "The comment was mean and it hurts your feelings. Why is the classmate probably saying it?",
        hint: "Think about what people who tease are usually looking for.",
        options: [
          {
            id: "opt1",
            text: "Because it's true and the shirt is actually bad.",
            isAccepted: false,
            feedback: "It's your favorite shirt! They are just being mean."
          },
          {
            id: "opt2",
            text: "They are trying to get a big reaction out of you, like making you cry or yell.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly. Teasing is often just a test to see if they can make you upset."
          },
          {
            id: "opt3",
            text: "Because they want to be your best friend.",
            isAccepted: false,
            feedback: "This is not how people make friends."
          }
        ]
      },
      {
        id: "teasing-1-q2",
        type: "choose-response",
        prompt: "If they want a big reaction, what is the smartest way to respond?",
        hint: "Don't give them what they want.",
        options: [
          {
            id: "opt1",
            text: "Cry and run to the bathroom.",
            isAccepted: false,
            feedback: "This gives them exactly the big reaction they wanted."
          },
          {
            id: "opt2",
            text: "Shrug your shoulders, say 'I like it,' and turn back to your food.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! A calm, boring response takes away all their power. It's called 'brushing it off'."
          },
          {
            id: "opt3",
            text: "Yell, 'Your shirt is ugly too!'",
            isAccepted: false,
            feedback: "Yelling back is a big reaction, and it might get you in trouble too."
          }
        ]
      },
      {
        id: "teasing-1-q3",
        type: "notice-signal",
        prompt: "When you just shrug and say 'I like it,' the classmate looks confused and walks away. Why did they leave?",
        hint: "Did their plan work?",
        options: [
          {
            id: "opt1",
            text: "They were scared of you.",
            isAccepted: false,
            feedback: "They weren't scared, they were just bored."
          },
          {
            id: "opt2",
            text: "Because you didn't give them a reaction, the teasing wasn't fun for them anymore.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! When you don't react, teasing becomes very boring and they usually stop."
          },
          {
            id: "opt3",
            text: "They went to get a teacher.",
            isAccepted: false,
            feedback: "They probably just went to sit down because their joke failed."
          }
        ]
      },
      {
        id: "teasing-1-q4",
        type: "repair",
        prompt: "What if you had yelled a mean name back at them, and a teacher heard YOU yell? How do you handle the teacher?",
        hint: "Be honest about the whole situation.",
        options: [
          {
            id: "opt1",
            text: "Say, 'I'm sorry I yelled. He was making fun of my shirt and I lost my temper.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent. You took responsibility for your yelling, but honestly explained why it happened."
          },
          {
            id: "opt2",
            text: "Say, 'I didn't yell!'",
            isAccepted: false,
            feedback: "Lying to the teacher will make things much worse."
          },
          {
            id: "opt3",
            text: "Run away from the teacher.",
            isAccepted: false,
            feedback: "You can't run from the teacher. It's best to just explain what happened calmly."
          }
        ]
      },
      {
        id: "teasing-1-q5",
        type: "transfer",
        prompt: "Someone tells you that your drawing of a dog looks like a potato. How can you brush it off?",
        hint: "Use a calm, unbothered reaction.",
        options: [
          {
            id: "opt1",
            text: "Tear up the paper.",
            isAccepted: false,
            feedback: "Don't destroy your hard work just because someone else was mean!"
          },
          {
            id: "opt2",
            text: "Smile and say, 'Well, I think it's a very cute potato then!' and keep drawing.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! Agreeing with them in a funny way makes the tease completely powerless."
          },
          {
            id: "opt3",
            text: "Throw a crayon at them.",
            isAccepted: false,
            feedback: "Throwing things is unsafe and will get you in trouble."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "When someone teases you, they are looking for a big reaction. Staying calm and 'brushing it off' takes away all their power!",
      realLifePractice: "Practice the 'shrug and say Okay' move in the mirror. See how bored and unbothered you can look!"
    }
  },
  // Family 13: Following Instructions
  {
    id: "instructions-1",
    familyId: "following-instructions",
    title: "The Fire Drill",
    ageRange: "7-8",
    skillName: "Following Instructions",
    situation: {
      setting: "The classroom",
      characters: [
        { name: "Mr. Davis", description: "Your teacher" }
      ],
      introduction: "The fire alarm goes off loudly. Mr. Davis says, 'Okay class, line up at the door quickly and quietly. Leave your backpacks behind.'"
    },
    questions: [
      {
        id: "instructions-1-q1",
        type: "understand",
        prompt: "Why is it important to follow these instructions immediately without arguing?",
        hint: "Think about why fire drills exist.",
        options: [
          {
            id: "opt1",
            text: "Because you might get a sticker.",
            isAccepted: false,
            feedback: "Fire drills are about safety, not rewards."
          },
          {
            id: "opt2",
            text: "Because it is a safety rule, and listening quickly keeps everyone safe.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Safety rules have to be followed immediately without any questions."
          },
          {
            id: "opt3",
            text: "Because Mr. Davis is mean.",
            isAccepted: false,
            feedback: "He isn't mean, he is just keeping everyone safe!"
          }
        ]
      },
      {
        id: "instructions-1-q2",
        type: "choose-response",
        prompt: "You really want to grab your new drawing from your desk so it doesn't get ruined. What should you do?",
        hint: "What did the teacher specifically say about taking things?",
        options: [
          {
            id: "opt1",
            text: "Run and grab it really fast.",
            isAccepted: false,
            feedback: "Running around during an emergency is dangerous and breaks the rule."
          },
          {
            id: "opt2",
            text: "Leave the drawing and go straight to the line.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect. Following the instruction to leave things behind keeps you safe."
          },
          {
            id: "opt3",
            text: "Ask Mr. Davis if you can just grab one thing.",
            isAccepted: false,
            feedback: "There is no time for arguing or asking questions during an alarm."
          }
        ]
      },
      {
        id: "instructions-1-q3",
        type: "notice-signal",
        prompt: "While standing in line outside, your friend starts whispering a joke to you. Mr. Davis puts his finger over his lips and looks right at you. What is he saying?",
        hint: "What does the finger over the lips mean?",
        options: [
          {
            id: "opt1",
            text: "He wants to hear the joke.",
            isAccepted: false,
            feedback: "During a drill, everyone must be silent."
          },
          {
            id: "opt2",
            text: "He is giving a non-verbal instruction to stop talking immediately.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Teachers use hand signals so they don't have to yell over the alarm."
          },
          {
            id: "opt3",
            text: "He is thinking.",
            isAccepted: false,
            feedback: "This specific gesture means 'be quiet'."
          }
        ]
      },
      {
        id: "instructions-1-q4",
        type: "repair",
        prompt: "What if you had run to grab your drawing, and Mr. Davis yelled, 'Leave it!' How can you fix your mistake quickly?",
        hint: "What is the fastest way to get back on track?",
        options: [
          {
            id: "opt1",
            text: "Drop the drawing and immediately walk to the line, then say sorry later.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent. Fixing the safety mistake is the most important thing, you can apologize when it's safe."
          },
          {
            id: "opt2",
            text: "Argue with him about how important the drawing is.",
            isAccepted: false,
            feedback: "Never argue during an emergency."
          },
          {
            id: "opt3",
            text: "Cry because he yelled.",
            isAccepted: false,
            feedback: "He yelled because it was loud and important. Just follow the rule!"
          }
        ]
      },
      {
        id: "instructions-1-q5",
        type: "transfer",
        prompt: "At the pool, the lifeguard blows the whistle and points for everyone to get out of the water. What do you do?",
        hint: "Apply the same rule for safety instructions.",
        options: [
          {
            id: "opt1",
            text: "Keep swimming until your parents tell you to get out.",
            isAccepted: false,
            feedback: "The lifeguard is in charge of safety. You must listen to them."
          },
          {
            id: "opt2",
            text: "Get out of the water safely and quickly, just like the lifeguard asked.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! You followed a safety instruction immediately without arguing."
          },
          {
            id: "opt3",
            text: "Splash the lifeguard.",
            isAccepted: false,
            feedback: "This is unsafe and very disrespectful."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "When an adult gives a safety instruction (like during a drill or at the pool), we must follow it immediately without arguing or asking questions.",
      realLifePractice: "Notice what hand signals your teacher uses for 'quiet' or 'line up', and try to obey them before they even use words!"
    }
  },
  // Family 14: Being a Good Guest
  {
    id: "guest-1",
    familyId: "being-a-good-guest",
    title: "The Playdate Snack",
    ageRange: "7-8",
    skillName: "Being a Good Guest",
    situation: {
      setting: "Your friend's kitchen",
      characters: [
        { name: "Friend's Mom", description: "Who is serving a snack" }
      ],
      introduction: "You are at your friend's house for a playdate. Their mom brings out a plate of apple slices and cheese for a snack. You really don't like cheese."
    },
    questions: [
      {
        id: "guest-1-q1",
        type: "understand",
        prompt: "Why is it important to be polite about food when you are a guest?",
        hint: "Think about how the mom is trying to be kind by feeding you.",
        options: [
          {
            id: "opt1",
            text: "Because she spent time and money offering it, and being polite shows respect.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Being a good guest means respecting the hospitality of the host."
          },
          {
            id: "opt2",
            text: "So she will buy you candy next time.",
            isAccepted: false,
            feedback: "You should be polite because it is the right thing to do, not for a reward."
          },
          {
            id: "opt3",
            text: "It isn't important, you can demand whatever you want.",
            isAccepted: false,
            feedback: "Demanding things at someone else's house is very rude."
          }
        ]
      },
      {
        id: "guest-1-q2",
        type: "choose-response",
        prompt: "What is the most polite way to handle not wanting the cheese?",
        hint: "How can you decline without being insulting?",
        options: [
          {
            id: "opt1",
            text: "Say, 'Ew, cheese is gross! I want cookies.'",
            isAccepted: false,
            feedback: "Calling food gross is insulting to the person who made it."
          },
          {
            id: "opt2",
            text: "Say, 'Thank you! I'll just have the apples please.'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! You said thank you and politely selected the part you like without making a fuss."
          },
          {
            id: "opt3",
            text: "Throw the cheese in the garbage.",
            isAccepted: false,
            feedback: "This wastes food and is very rude."
          }
        ]
      },
      {
        id: "guest-1-q3",
        type: "notice-signal",
        prompt: "The mom smiles and says, 'No problem, enjoy the apples.' What does her reaction mean?",
        hint: "Did you handle it well?",
        options: [
          {
            id: "opt1",
            text: "She appreciates that you were polite and she is happy to let you just eat the apples.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Yes! Adults don't mind if you don't like something, as long as you are polite about it."
          },
          {
            id: "opt2",
            text: "She is secretly mad.",
            isAccepted: false,
            feedback: "She smiled and said 'no problem', so she is fine with it."
          },
          {
            id: "opt3",
            text: "She is going to call your parents.",
            isAccepted: false,
            feedback: "You were polite, so there is no reason to call your parents."
          }
        ]
      },
      {
        id: "guest-1-q4",
        type: "repair",
        prompt: "What if you accidentally said 'Ew!' before you thought about it? How can you fix it?",
        hint: "Apologize and use better words.",
        options: [
          {
            id: "opt1",
            text: "Keep saying how gross it is.",
            isAccepted: false,
            feedback: "This makes the problem worse."
          },
          {
            id: "opt2",
            text: "Say, 'Oops, I'm sorry, that was rude. I just meant I don't really care for cheese. The apples look great though!'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You apologized for the word 'ew' and complimented the apples."
          },
          {
            id: "opt3",
            text: "Run and hide in your friend's room.",
            isAccepted: false,
            feedback: "Hiding doesn't solve the rudeness."
          }
        ]
      },
      {
        id: "guest-1-q5",
        type: "transfer",
        prompt: "You are at your grandparents' house and they offer to watch a documentary about history, but you find it boring. What do you do?",
        hint: "Use your polite guest skills.",
        options: [
          {
            id: "opt1",
            text: "Say, 'That sounds boring, let's watch cartoons.'",
            isAccepted: false,
            feedback: "Calling their idea boring is insulting."
          },
          {
            id: "opt2",
            text: "Watch a few minutes politely, or ask kindly, 'Could we maybe watch a nature show instead?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! You can try their idea or politely offer a compromise."
          },
          {
            id: "opt3",
            text: "Fall asleep loudly on purpose.",
            isAccepted: false,
            feedback: "This is rude and disrespectful."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "Being a good guest means using 'please' and 'thank you', and finding polite ways to say 'no thank you' to things you don't like.",
      realLifePractice: "Next time you are at a friend's house, remember to say 'Thank you for having me!' when you leave."
    }
  },
  // Family 15: Understanding Body Language
  {
    id: "body-1",
    familyId: "understanding-body-language",
    title: "The Bored Listener",
    ageRange: "7-8",
    skillName: "Understanding Body Language",
    situation: {
      setting: "The school bus",
      characters: [
        { name: "Alex", description: "Your bus seatmate" }
      ],
      introduction: "You are sitting next to Alex on the bus, explaining all the rules to a very long video game you play. You've been talking about it for ten minutes."
    },
    questions: [
      {
        id: "body-1-q1",
        type: "understand",
        prompt: "Why is it important to check the other person's face and body when you are talking a lot?",
        hint: "Think about making sure the conversation is fun for both of you.",
        options: [
          {
            id: "opt1",
            text: "To make sure they know you are the boss.",
            isAccepted: false,
            feedback: "Conversations aren't about being the boss, they are about sharing."
          },
          {
            id: "opt2",
            text: "To see if they are still interested and having fun, or if they are getting bored.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Exactly! Good communicators check to make sure the listener is still engaged."
          },
          {
            id: "opt3",
            text: "To make sure they don't fall asleep.",
            isAccepted: false,
            feedback: "While true, the main goal is to make sure they are enjoying the chat."
          }
        ]
      },
      {
        id: "body-1-q2",
        type: "notice-signal",
        prompt: "You look at Alex. He is staring out the window, resting his chin on his hand, and occasionally just saying 'Uh-huh' without looking at you. What is his body language saying?",
        hint: "Is he excited about the video game rules?",
        options: [
          {
            id: "opt1",
            text: "He is so amazed by the game that he is speechless.",
            isAccepted: false,
            feedback: "Staring out the window usually means someone is disengaged."
          },
          {
            id: "opt2",
            text: "He is bored and has stopped listening.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Spot on. Looking away and giving short answers are classic signs of boredom."
          },
          {
            id: "opt3",
            text: "He wants you to talk louder.",
            isAccepted: false,
            feedback: "Talking louder won't make him more interested!"
          }
        ]
      },
      {
        id: "body-1-q3",
        type: "choose-response",
        prompt: "You notice that Alex is bored. What is the best way to change the conversation?",
        hint: "How can you include him?",
        options: [
          {
            id: "opt1",
            text: "Keep talking about the game but poke him so he pays attention.",
            isAccepted: false,
            feedback: "Never poke people to force them to listen!"
          },
          {
            id: "opt2",
            text: "Stop talking about the game and ask, 'What did you do this weekend?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Perfect! Asking a question about *him* brings him back into the conversation."
          },
          {
            id: "opt3",
            text: "Yell at him for ignoring you.",
            isAccepted: false,
            feedback: "It's hard to listen to a 10-minute speech. Just change the subject instead."
          }
        ]
      },
      {
        id: "body-1-q4",
        type: "repair",
        prompt: "What if you kept talking for another ten minutes, and Alex finally sighed loudly and put his headphones on? How can you fix it tomorrow?",
        hint: "How do you show you learned from your mistake?",
        options: [
          {
            id: "opt1",
            text: "Tomorrow, sit down and say, 'Sorry I talked so much yesterday. What games do *you* like?'",
            isAccepted: true,
            isBestFit: true,
            feedback: "Excellent repair. You acknowledged you talked too much and immediately gave him a turn to share."
          },
          {
            id: "opt2",
            text: "Ignore him forever.",
            isAccepted: false,
            feedback: "You can just try to be a better listener next time."
          },
          {
            id: "opt3",
            text: "Pull his headphones off.",
            isAccepted: false,
            feedback: "Never touch someone else's belongings or body in anger."
          }
        ]
      },
      {
        id: "body-1-q5",
        type: "transfer",
        prompt: "You are telling your mom a story, but you notice she is typing on her computer and furrowing her eyebrows. What does her body language mean?",
        hint: "Is she able to focus on your story?",
        options: [
          {
            id: "opt1",
            text: "She is mad at you.",
            isAccepted: false,
            feedback: "She is probably just focused on her work, not mad at you."
          },
          {
            id: "opt2",
            text: "She is busy and distracted right now. You should ask if it's a good time to talk.",
            isAccepted: true,
            isBestFit: true,
            feedback: "Brilliant! Reading her distracted body language and waiting for a better time is very mature."
          },
          {
            id: "opt3",
            text: "She is listening perfectly.",
            isAccepted: false,
            feedback: "Typing and furrowing brows usually means someone is concentrating on something else."
          }
        ]
      }
    ],
    completion: {
      skillSummary: "People 'talk' with their bodies! If someone is looking away, sighing, or giving short answers, they might be bored or busy. It's a signal to change the subject or ask them a question.",
      realLifePractice: "When you talk to someone today, look at their eyes and shoulders. Are they pointed toward you (interested) or away from you (distracted)?"
    }
  }
];
