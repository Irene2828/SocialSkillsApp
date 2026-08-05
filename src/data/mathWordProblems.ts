import { StepBasedQuestion } from './types';

export const mathWordProblems: StepBasedQuestion[] = [
  // FAMILY 1: Progress toward a multi-week goal
  {
    id: "mwp_1",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: Mia loves riding her bike. She set a big goal to complete exactly 100 cycling laps around the park over four weeks! To stay on track, she carefully wrote down her progress in her training journal.\nFacts: Here are the laps she completed during Week 1:\n- Monday: 8 laps\n- Wednesday: 10 laps\n- Thursday: 12 laps\n- Saturday: 14 laps\nDetails: During Week 2, she was a bit tired. On each training day, she only completed half as many laps as she did on the matching day in Week 1. By Week 3, she found a great rhythm and completed an even number of laps that is greater than 20 and less than 24.\nQuestion: How many laps must Mia complete during Week 4 to reach her goal of exactly 100 laps?",
    steps: [
      {
        id: "mwp_1_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "How many laps she completed in Week 1",
          "How many laps must Mia complete during Week 4 to reach exactly 100 laps",
          "The total number of laps for the first three weeks"
        ],
        correctIndex: 1,
        explanation: "Correct! We need to find the remaining laps Mia needs to complete in Week 4."
      },
      {
        id: "mwp_1_s2",
        prompt: "What should be our first step?",
        options: [
          "Find the total laps completed in Week 1",
          "Find how many laps are needed in Week 4",
          "Multiply the laps of Wednesday by 4"
        ],
        correctIndex: 0,
        explanation: "Correct! First we must find the total laps for Week 1 so we can find Week 2's laps."
      },
      {
        id: "mwp_1_s3",
        prompt: "What's our second step?",
        options: [
          "Find the laps for Week 2 and Week 3 based on the story details",
          "Subtract Week 1 laps from 100 laps",
          "Multiply Wednesday's laps by Thursday's laps"
        ],
        correctIndex: 0,
        explanation: "Great job! We need to figure out how many laps she did in Week 2 and Week 3 next."
      },
      {
        id: "mwp_1_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Add the laps of Weeks 1, 2, and 3 together, then subtract from the 100 lap goal",
          "Subtract Week 3 laps from Week 1 laps",
          "Divide 100 by the total number of weeks"
        ],
        correctIndex: 0,
        explanation: "Excellent! Finding the total completed so far and subtracting it from the goal gives the final answer."
      },
      {
        id: "mwp_1_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "22 laps",
          "12 laps",
          "10 laps"
        ],
        correctIndex: 1,
        explanation: "Correct! 100 laps − 88 laps = 12 laps needed in Week 4. Fantastic job!"
      }
    ]
  },
  {
    id: "mwp_2",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: Noah is a bookworm! His teacher gave the class a reading challenge: read exactly 90 pages over four weeks. Noah wants to win the challenge, so he reads every single day.\nFacts: Here are the pages Noah read during Week 1:\n- Monday: 6 pages\n- Tuesday: 8 pages\n- Thursday: 10 pages\n- Friday: 12 pages\nDetails: During Week 2, he was busy with soccer practice, so on each reading day he only read half as many pages as he read on the matching day in Week 1. During Week 3, he had more free time and read an even number of pages that is greater than 18 and less than 22.\nQuestion: How many pages must Noah read during Week 4 to reach his goal of exactly 90 pages?",
    steps: [
      {
        id: "mwp_2_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "How many pages Noah must read during Week 4 to reach exactly 90 pages",
          "How many pages he read in Week 1",
          "The total pages read during the first three weeks"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to find out how many pages Noah needs to read in the final week."
      },
      {
        id: "mwp_2_s2",
        prompt: "What should be our first step?",
        options: [
          "Find the total pages read in Week 1",
          "Subtract Week 2 pages from 90 pages",
          "Multiply Monday's pages by Tuesday's pages"
        ],
        correctIndex: 0,
        explanation: "Exactly! Finding Week 1's total allows us to figure out Week 2 next."
      },
      {
        id: "mwp_2_s3",
        prompt: "What's our second step?",
        options: [
          "Find the pages read in Week 2 and Week 3 based on the details provided",
          "Subtract Week 1 pages from 90 pages",
          "Multiply Week 1 pages by Week 2 pages"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to calculate the pages for Week 2 and Week 3 based on the story."
      },
      {
        id: "mwp_2_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Add the pages of Weeks 1, 2, and 3 together, then subtract from the 90 page goal",
          "Subtract Week 3 pages from Week 1 pages",
          "Divide 90 pages by 4 weeks"
        ],
        correctIndex: 0,
        explanation: "Yes! Finding the total completed so far and subtracting it from the goal gives the final answer."
      },
      {
        id: "mwp_2_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "16 pages",
          "14 pages",
          "20 pages"
        ],
        correctIndex: 0,
        explanation: "Correct! 90 pages − 74 pages = 16 pages needed in Week 4. Well done!"
      }
    ]
  },
  {
    id: "mwp_3",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: Lila is practicing her basketball free throws. Her coach wants her to complete exactly 110 perfect practice shots before her big tournament in four weeks.\nFacts: Here is her practice schedule for Week 1:\n- Monday: 10 shots\n- Tuesday: 12 shots\n- Wednesday: 14 shots\n- Friday: 8 shots\nDetails: During Week 2, she had a lot of homework, so on each practice day she only completed half as many shots as she completed on the matching day in Week 1. During Week 3, she bounced back and completed an odd number of shots that is greater than 23 and less than 27.\nQuestion: How many practice shots must Lila complete during Week 4 to reach her coach's goal of exactly 110 shots?",
    steps: [
      {
        id: "mwp_3_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "How many practice shots Lila must complete during Week 4 to reach exactly 110 shots",
          "How many shots she completed in Week 1",
          "The total shots completed in Week 2 and Week 3"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to find how many shots are left for Week 4."
      },
      {
        id: "mwp_3_s2",
        prompt: "What should be our first step?",
        options: [
          "Find the total shots completed in Week 1",
          "Subtract Week 2 shots from 110 shots",
          "Multiply Monday's shots by Tuesday's shots"
        ],
        correctIndex: 0,
        explanation: "Right! Finding Week 1's total helps us find Week 2's shots."
      },
      {
        id: "mwp_3_s3",
        prompt: "What's our second step?",
        options: [
          "Find the shots completed in Week 2 and Week 3 using the story details",
          "Subtract Week 1 shots from 110 shots",
          "Multiply Week 1 shots by Week 2 shots"
        ],
        correctIndex: 0,
        explanation: "Correct! We have to figure out how many shots she made in Week 2 and Week 3."
      },
      {
        id: "mwp_3_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Add the shots of Weeks 1, 2, and 3 together, then subtract from the 110 shot goal",
          "Subtract Week 3 shots from Week 1 shots",
          "Divide 110 shots by 4 weeks"
        ],
        correctIndex: 0,
        explanation: "Yes! Finding the total completed so far and subtracting it from the goal gives the final answer."
      },
      {
        id: "mwp_3_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "19 shots",
          "21 shots",
          "29 shots"
        ],
        correctIndex: 0,
        explanation: "Correct! 110 shots − 91 shots = 19 shots needed in Week 4. Fantastic job!"
      }
    ]
  },

  // FAMILY 2: Read a chart, follow a selection rule, and find what remains
  {
    id: "mwp_4",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: The teacher wants the class to participate in a fun outdoor activity this weekend. She asked all the students to vote on which activity they wanted to do most.\nFacts: Here are the votes from the class:\n- River cleanup: 12 students\n- Birdhouse workshop: 18 students\n- Tree planting: 24 students\n- Nature walk: 15 students\nDetails: The teacher promised she would choose the activity that was selected by more than 20 students. However, to pay for the materials, the chosen activity requires the whole class to sell a total of 80 recycled-paper greeting cards. Every participating student in that group has already sold exactly one card.\nQuestion: How many more cards must the students sell to reach their goal of 80 cards?",
    steps: [
      {
        id: "mwp_4_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "Which activity has the most votes",
          "How many more cards the students must sell to reach their goal of 80 cards",
          "How many students voted in total"
        ],
        correctIndex: 1,
        explanation: "Correct! We need to find out the remaining number of cards that must be sold."
      },
      {
        id: "mwp_4_s2",
        prompt: "What should be our first step?",
        options: [
          "Find which activity has more than 20 votes",
          "Add all the votes together",
          "Multiply the cleanup votes by 2"
        ],
        correctIndex: 0,
        explanation: "Correct! We have to look at the chart to see which activity was chosen."
      },
      {
        id: "mwp_4_s3",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Find how many cards the participating students already sold, and subtract that from the goal of 80",
          "Divide 80 cards by the winning students",
          "Add all the votes to 80 cards"
        ],
        correctIndex: 0,
        explanation: "Right! We subtract the cards already sold from the goal to find how many are left to sell."
      },
      {
        id: "mwp_4_s4",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "54 cards",
          "56 cards",
          "66 cards"
        ],
        correctIndex: 1,
        explanation: "Correct! 80 cards goal − 24 cards sold = 56 more cards to sell. Great work!"
      }
    ]
  },
  {
    id: "mwp_5",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: It's time for the spring semester project! The class took a vote to decide what they should build for the school.\nFacts: Here are the project votes:\n- Hallway mural: 14 students\n- School garden: 22 students\n- Robotics display: 26 students\n- Music performance: 19 students\nDetails: The teacher will only choose the project selected by more than 24 students. The winning project is very expensive, so it requires the students to sell 90 coupon books to raise money. Luckily, each participating student in that group has already sold exactly one coupon book.\nQuestion: How many more coupon books must the students sell to hit their goal of 90 books?",
    steps: [
      {
        id: "mwp_5_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "How many more coupon books the students must sell to hit their goal of 90 books",
          "Which project won the vote",
          "How many coupon books each student has already sold"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to find the remaining coupon books needed."
      },
      {
        id: "mwp_5_s2",
        prompt: "What should be our first step?",
        options: [
          "Find which project has more than 24 votes",
          "Add all the votes together",
          "Subtract the garden votes from the mural votes"
        ],
        correctIndex: 0,
        explanation: "Right! We have to find which project won the vote."
      },
      {
        id: "mwp_5_s3",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Find how many coupon books the participating students already sold, and subtract that from the goal of 90",
          "Divide 90 books by the winning students",
          "Multiply the winning students by 90 books"
        ],
        correctIndex: 0,
        explanation: "Yes! We subtract the books already sold from the total goal to find how many are left."
      },
      {
        id: "mwp_5_s4",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "64 coupon books",
          "54 coupon books",
          "74 coupon books"
        ],
        correctIndex: 0,
        explanation: "Correct! 90 books goal − 26 books sold = 64 more coupon books to sell. Outstanding!"
      }
    ]
  },
  {
    id: "mwp_6",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: The class is organizing an activity to raise money for the local animal shelter. They voted on their favorite ideas.\nFacts: Here are the charity votes:\n- Dog walk: 17 students\n- Cat-toy workshop: 21 students\n- Pet-food drive: 28 students\n- Adoption posters: 13 students\nDetails: The teacher says the class must choose the activity selected by more than 25 students. The chosen activity requires the students to sell 100 kindness cards to cover the costs. Every participating student in that group has already sold exactly one card.\nQuestion: How many more kindness cards must the students sell to reach 100?",
    steps: [
      {
        id: "mwp_6_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "Which charity project had the most votes",
          "How many more kindness cards the students must sell to reach their goal of 100 cards",
          "The total number of kindness cards already sold"
        ],
        correctIndex: 1,
        explanation: "Correct! We need to find the remaining kindness cards that must be sold."
      },
      {
        id: "mwp_6_s2",
        prompt: "What should be our first step?",
        options: [
          "Find which activity has more than 25 votes",
          "Add all the votes together",
          "Multiply the dog walk votes by 3"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to find which activity was chosen first."
      },
      {
        id: "mwp_6_s3",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Find how many cards the participating students already sold, and subtract that from the goal of 100",
          "Divide 100 cards by the winning students",
          "Add all votes to 100 cards"
        ],
        correctIndex: 0,
        explanation: "Right! We subtract the cards already sold from the goal to find how many are left to sell."
      },
      {
        id: "mwp_6_s4",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "62 kindness cards",
          "72 kindness cards",
          "82 kindness cards"
        ],
        correctIndex: 1,
        explanation: "Correct! 100 cards goal − 28 cards sold = 72 more kindness cards to sell. Superb job!"
      }
    ]
  },

  // FAMILY 3: Group size, seating capacity, ticket packets, and price comparison
  {
    id: "mwp_7",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: A large family is having a reunion at the circus! There are 7 adults in the family, and there are 5 more children than adults.\nFacts: The circus has three different sections:\n- The Star Tent has 3 rows of 6 seats. A packet of 10 tickets costs $40.\n- The Moon Tent has 5 rows of 5 seats. A packet of 10 tickets costs $47.\n- The Comet Tent has 6 rows of 4 seats. A packet of 10 tickets costs $44.\nDetails: The whole family wants to sit together in the same reserved section. They need to figure out which tent is big enough for everyone, but they also want to choose the one that is the least expensive!\nQuestion: Which tent fits the whole group and is the least expensive, and how much will all of their tickets cost?",
    steps: [
      {
        id: "mwp_7_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "How many adults and children are in the family",
          "Which tent fits the whole group and is the least expensive, and how much the tickets cost",
          "The total number of seats in the Comet Tent"
        ],
        correctIndex: 1,
        explanation: "Correct! We need to find the correct tent that fits the family and is the cheapest, along with the total cost."
      },
      {
        id: "mwp_7_s2",
        prompt: "What should be our first step?",
        options: [
          "Calculate the total number of people in the family (adults + children)",
          "Multiply 7 adults by 5 children",
          "Subtract 5 children from 7 adults"
        ],
        correctIndex: 0,
        explanation: "Exactly! We need to know how big the family is to see which tent fits them."
      },
      {
        id: "mwp_7_s3",
        prompt: "What's our second step?",
        options: [
          "Find which tents have enough seats for the whole family by multiplying the rows by seats",
          "Divide the family size by the number of rows in the Star Tent",
          "Add all rows of the three tents together"
        ],
        correctIndex: 0,
        explanation: "Correct! We must find out the seating capacity of each tent to see which ones are big enough."
      },
      {
        id: "mwp_7_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Calculate how many packets of tickets the family needs to buy for the tents that are big enough, and compare the costs to find the cheapest one",
          "Buy 1 packet of tickets for the Moon Tent",
          "Multiply the total family size by $40"
        ],
        correctIndex: 0,
        explanation: "Right! We calculate the ticket cost for the big enough tents, and choose the cheapest."
      },
      {
        id: "mwp_7_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "Moon Tent, $94",
          "Comet Tent, $88",
          "Comet Tent, $44"
        ],
        correctIndex: 1,
        explanation: "Correct! The Comet Tent fits everyone and is the cheapest at $88 total. Incredible math skills!"
      }
    ]
  },
  {
    id: "mwp_8",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: A school science club is booking a room for their big movie night! There are 6 adults coming, and there are 3 more children than adults.\nFacts: They have three rooms they can rent:\n- The Mars Room has 4 rows of 3 seats. A packet of 5 tickets costs $36.\n- The Saturn Room has 4 rows of 4 seats. A packet of 5 tickets costs $42.\n- The Galaxy Room has 3 rows of 6 seats. A packet of 5 tickets costs $38.\nDetails: The whole club must sit together in the same reserved room. They need to find a room that is big enough for everyone to watch the movie, but they want to spend the least amount of club money possible.\nQuestion: Which room fits the whole group and is the least expensive, and what will the tickets cost?",
    steps: [
      {
        id: "mwp_8_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "Which room fits the whole group and is the least expensive, and how much the tickets cost",
          "How many children are in the science club",
          "The ticket price for the Mars Room"
        ],
        correctIndex: 0,
        explanation: "Correct! We must find the cheapest room that fits everyone, plus the final ticket cost."
      },
      {
        id: "mwp_8_s2",
        prompt: "What should be our first step?",
        options: [
          "Calculate the total number of people in the science club (adults + children)",
          "Multiply 6 adults by 3 children",
          "Subtract 3 children from 6 adults"
        ],
        correctIndex: 0,
        explanation: "Exactly! We need to know the total group size to see which room fits them."
      },
      {
        id: "mwp_8_s3",
        prompt: "What's our second step?",
        options: [
          "Find which rooms have enough seats for the whole group by multiplying the rows by seats",
          "Multiply the Mars Room rows by the Galaxy Room rows",
          "Add all rows in all rooms together"
        ],
        correctIndex: 0,
        explanation: "Right! We must find out the seating capacity of each room to see which ones are big enough."
      },
      {
        id: "mwp_8_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Calculate how many packets of tickets the group needs to buy for the rooms that are big enough, and compare the costs to find the cheapest one",
          "Buy 2 packets for the Mars Room",
          "Multiply the total group size by $36"
        ],
        correctIndex: 0,
        explanation: "Correct! We calculate the ticket cost for the big enough rooms, and choose the cheapest."
      },
      {
        id: "mwp_8_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "Saturn Room, $126",
          "Galaxy Room, $114",
          "Galaxy Room, $76"
        ],
        correctIndex: 1,
        explanation: "Correct! The Galaxy Room fits everyone and is the cheapest at $114. Amazing work!"
      }
    ]
  },
  {
    id: "mwp_9",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: A large tour group is visiting the science museum to watch a presentation. There are 9 adults in the group, and there are 3 more children than adults.\nFacts: The museum has three different stages:\n- The Red Stage has 4 rows of 5 seats. A packet of 7 tickets costs $48.\n- The Blue Stage has 5 rows of 5 seats. A packet of 7 tickets costs $45.\n- The Green Stage has 6 rows of 4 seats. A packet of 7 tickets costs $43.\nDetails: The whole tour group wants to sit together in the same section. They want to find a section that is big enough for everyone, but they also want to choose the cheapest option available.\nQuestion: Which stage fits the whole group and is the least expensive, and how much will the tickets cost?",
    steps: [
      {
        id: "mwp_9_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "Which stage fits the whole group and is the least expensive, and the ticket cost",
          "How many adults are in the tour group",
          "The total number of rows on the Blue Stage"
        ],
        correctIndex: 0,
        explanation: "Correct! We must find the cheapest stage that has enough seats for the group."
      },
      {
        id: "mwp_9_s2",
        prompt: "What should be our first step?",
        options: [
          "Calculate the total number of people in the tour group (adults + children)",
          "Multiply 9 adults by 3 children",
          "Subtract 3 children from 9 adults"
        ],
        correctIndex: 0,
        explanation: "Exactly! We need to know the total group size to see which stage fits them."
      },
      {
        id: "mwp_9_s3",
        prompt: "What's our second step?",
        options: [
          "Find which stages have enough seats for the whole group by multiplying the rows by seats",
          "Divide the group size by the rows on the Blue Stage",
          "Add all rows from all stages together"
        ],
        correctIndex: 0,
        explanation: "Right! We must find out the seating capacity of each stage to see which ones are big enough."
      },
      {
        id: "mwp_9_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Calculate how many packets of tickets the group needs to buy for the stages that are big enough, and compare the costs to find the cheapest one",
          "Buy 2 packets for the Red Stage",
          "Multiply the total group size by $48"
        ],
        correctIndex: 0,
        explanation: "Correct! We calculate the ticket cost for the big enough stages, and choose the cheapest."
      },
      {
        id: "mwp_9_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "Blue Stage, $135",
          "Green Stage, $129",
          "Green Stage, $86"
        ],
        correctIndex: 1,
        explanation: "Correct! The Green Stage fits everyone and is the cheapest at $129. Stellar job!"
      }
    ]
  },

  // FAMILY 4: Points budget with several conditions
  {
    id: "mwp_10",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: You are visiting an amazing amusement park and you just bought a Points card that is loaded with 95 points! You can't wait to see the shows and go on the rides.\nFacts: Here are the prices at the park:\n- Dolphin show: 25 points\n- Shark show: 45 points\n- Seal show: 40 points\n- Every ride at the park costs exactly 5 points each.\nDetails: Your mom gave you some strict rules for the day! You must attend exactly two different shows. Then, you must use all of your remaining points on rides. However, you must go on an odd number of rides, and it must be more than one ride.\nQuestion: Which two shows should you attend, and how many rides can you go on?",
    steps: [
      {
        id: "mwp_10_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "How many points each show costs",
          "Which two shows to attend, and how many rides to go on to follow all the rules",
          "The total points you started with"
        ],
        correctIndex: 1,
        explanation: "Correct! We need to find the correct show combination and ride count that satisfies all conditions."
      },
      {
        id: "mwp_10_s2",
        prompt: "What should be our first step?",
        options: [
          "Pick two shows, add their points, and subtract that from the total points to see how many points are left for rides",
          "Attend only the Shark show",
          "Go on 10 rides first"
        ],
        correctIndex: 0,
        explanation: "Exactly! We have to find how many points are left for rides after attending two shows."
      },
      {
        id: "mwp_10_s3",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Divide the remaining points by 5 to find the number of rides, and check if it's an odd number greater than one",
          "Multiply the remaining points by 5 to find the number of rides",
          "Go on 12 rides using all points"
        ],
        correctIndex: 0,
        explanation: "Correct! If the number of rides is odd and greater than one, you've found the right shows!"
      },
      {
        id: "mwp_10_s4",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "Dolphin show & Shark show, 5 rides",
          "Dolphin show & Seal show, 6 rides",
          "Shark show & Seal show, 2 rides"
        ],
        correctIndex: 0,
        explanation: "Correct! Choosing the Dolphin and Shark shows leaves 25 points, which gives exactly 5 rides (an odd number). Fantastic work!"
      }
    ]
  },
  {
    id: "mwp_11",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: You are at the summer carnival and you have a huge Points card loaded with 105 points to spend!\nFacts: Here is the price list for the carnival:\n- Magic show: 20 points\n- Acrobat show: 35 points\n- Puppet show: 50 points\n- Every ride costs exactly 5 points each.\nDetails: You want to maximize your fun, so you set some strict rules for yourself. You will attend exactly two different shows, and you will use all of your remaining points on rides. You want to make sure you go on an odd number of rides, and it must be more than one ride.\nQuestion: Which two shows should you attend, and how many rides can you go on?",
    steps: [
      {
        id: "mwp_11_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "Which two shows to attend and how many rides to go on to follow all the rules",
          "How many points a ride costs",
          "The cost of the Puppet show"
        ],
        correctIndex: 0,
        explanation: "Correct! We must find the correct combination of two shows and the odd number of rides."
      },
      {
        id: "mwp_11_s2",
        prompt: "What should be our first step?",
        options: [
          "Pick two shows, add their points, and subtract that from the total points to see how many points are left for rides",
          "Test Acrobat and Puppet shows by dividing their points",
          "Go on 5 rides first"
        ],
        correctIndex: 0,
        explanation: "Exactly! We have to find how many points are left for rides after attending two shows."
      },
      {
        id: "mwp_11_s3",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Divide the remaining points by 5 to find the number of rides, and check if it's an odd number greater than one",
          "Multiply the remaining points by 5 to find the number of rides",
          "Go on 14 rides using all points"
        ],
        correctIndex: 0,
        explanation: "Correct! If the number of rides is odd and greater than one, you've found the right shows!"
      },
      {
        id: "mwp_11_s4",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "Magic show & Puppet show, 7 rides",
          "Magic show & Acrobat show, 10 rides",
          "Acrobat show & Puppet show, 4 rides"
        ],
        correctIndex: 0,
        explanation: "Correct! Magic and Puppet shows leave 35 points, which gives exactly 7 rides (an odd number). Great analytical skills!"
      }
    ]
  },
  {
    id: "mwp_12",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: You are visiting the National Space Center and you have a VIP Points card loaded with 125 points!\nFacts: Here are the prices for the attractions:\n- Rocket show: 30 points\n- Astronaut show: 45 points\n- Planet show: 55 points\n- Every ride costs exactly 5 points each.\nDetails: The tour guide gives you some strict rules. You must attend exactly two different shows. Then, you must use all of your remaining points on rides. Lastly, you must go on an odd number of rides, and it must be more than one ride.\nQuestion: Which two shows should you attend, and how many rides can you go on?",
    steps: [
      {
        id: "mwp_12_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "Which two shows to attend and how many rides to go on to satisfy all conditions",
          "How many points the VIP card has",
          "The ticket price of the Rocket show"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to determine the correct show combination and number of rides."
      },
      {
        id: "mwp_12_s2",
        prompt: "What should be our first step?",
        options: [
          "Pick two shows, add their points, and subtract that from the total points to see how many points are left for rides",
          "Multiply the Rocket show and Planet show points",
          "Go on 15 rides first"
        ],
        correctIndex: 0,
        explanation: "Exactly! We have to find how many points are left for rides after attending two shows."
      },
      {
        id: "mwp_12_s3",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Divide the remaining points by 5 to find the number of rides, and check if it's an odd number greater than one",
          "Multiply the remaining points by 5 to find the number of rides",
          "Go on 20 rides using all points"
        ],
        correctIndex: 0,
        explanation: "Correct! If the number of rides is odd and greater than one, you've found the right shows!"
      },
      {
        id: "mwp_12_s4",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "Astronaut show & Planet show, 5 rides",
          "Rocket show & Astronaut show, 10 rides",
          "Rocket show & Planet show, 8 rides"
        ],
        correctIndex: 0,
        explanation: "Correct! Astronaut and Planet shows leave 25 points, which gives exactly 5 rides (an odd number). Magnificent math work!"
      }
    ]
  },

  // FAMILY 5: Build an object from solids and calculate the cost of plane figures
  {
    id: "mwp_13",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: Leonardo's little brother dreams of becoming an astronaut. For his birthday, Leonardo wants to build him an amazing toy rocket. To make the rocket, Leonardo will use these solids: 2 cubes, 1 square prism, and 1 triangular pyramid.\nFacts: Leonardo needs to buy plane figures to make the solids on his list. One cube has 6 square faces. One square prism has 2 square faces and 4 rectangular faces. One triangular pyramid has 4 triangular faces. The store sells figures in packets. A packet of 7 squares costs $5, a packet of 4 rectangles costs $1, a packet of 4 triangles costs $3, and one single circle costs $2.\nDetails: At the store, Leonardo decides that it would be a good idea to decorate the rocket with some circles. He chooses exactly 5 circles to put on the sides of the rocket.\nQuestion: How much will it cost to buy all the plane figures that Leonardo needs to build the rocket?",
    steps: [
      {
        id: "mwp_13_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "How many solids Leonardo needs to build the rocket",
          "The total cost to buy all the plane figures needed to build and decorate the rocket",
          "The cost of one single circle"
        ],
        correctIndex: 1,
        explanation: "Correct! We need to find the total cost of all the shapes required."
      },
      {
        id: "mwp_13_s2",
        prompt: "What should be our first step?",
        options: [
          "Calculate how many squares and rectangles are needed for the cubes and the prism, and find their packet costs",
          "Subtract the triangle cost from the circle cost",
          "Calculate the circle cost first"
        ],
        correctIndex: 0,
        explanation: "Exactly! Figuring out the number of squares and rectangles and their costs is a great place to start."
      },
      {
        id: "mwp_13_s3",
        prompt: "What's our second step?",
        options: [
          "Calculate how many triangles are needed for the pyramid and find their packet cost, and also calculate the cost of the circles",
          "Multiply rectangles by circles",
          "Add squares and rectangles together first"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to calculate the cost for the triangles and the circles next."
      },
      {
        id: "mwp_13_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Add up the costs of the squares, rectangles, triangles, and circles to find the final price",
          "Subtract circles from squares",
          "Divide the total cost by 4 shape types"
        ],
        correctIndex: 0,
        explanation: "Yes! Summing the costs of all components gives us the final price."
      },
      {
        id: "mwp_13_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "$22",
          "$24",
          "$26"
        ],
        correctIndex: 1,
        explanation: "Correct! The total cost to build the rocket is exactly $24. Brilliant job!"
      }
    ]
  },
  {
    id: "mwp_14",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: Priya wants to build a magnificent castle for her school history project. To make the castle, Priya will use these solids: 1 cube, 2 square prisms, and 2 triangular pyramids.\nFacts: Priya needs to buy plane figures to make the solids. One cube has 6 square faces. One square prism has 2 square faces and 4 rectangular faces. One triangular pyramid has 4 triangular faces. The store sells a packet of 5 squares for $4, a packet of 4 rectangles for $2, a packet of 4 triangles for $3, and one round window for $1.\nDetails: At the store, Priya decides that it would be a beautiful idea to decorate the castle with some round windows. She chooses exactly 4 round windows for her castle walls.\nQuestion: How much will it cost to buy all the plane figures that Priya needs to build the castle?",
    steps: [
      {
        id: "mwp_14_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "The total cost to buy all the plane figures Priya needs to build and decorate the castle",
          "How many square prisms Priya is using",
          "The cost of one single round window"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to find the total cost of all the shapes required."
      },
      {
        id: "mwp_14_s2",
        prompt: "What should be our first step?",
        options: [
          "Calculate how many squares and rectangles are needed for the cube and the prisms, and find their packet costs",
          "Subtract the rectangle cost from the square cost",
          "Calculate the window cost first"
        ],
        correctIndex: 0,
        explanation: "Exactly! Figuring out the number of squares and rectangles and their costs is a great place to start."
      },
      {
        id: "mwp_14_s3",
        prompt: "What's our second step?",
        options: [
          "Calculate how many triangles are needed for the pyramids and find their packet cost, and also calculate the cost of the windows",
          "Multiply rectangles by windows",
          "Add squares and rectangles together first"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to calculate the cost for the triangles and the windows next."
      },
      {
        id: "mwp_14_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Add up the costs of the squares, rectangles, triangles, and windows to find the final price",
          "Subtract windows from squares",
          "Divide the total cost by 4 shape types"
        ],
        correctIndex: 0,
        explanation: "Yes! Summing the costs of all components gives us the final price."
      },
      {
        id: "mwp_14_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "$20",
          "$22",
          "$24"
        ],
        correctIndex: 1,
        explanation: "Correct! The total cost to build the castle is exactly $22. Tremendous job!"
      }
    ]
  },
  {
    id: "mwp_15",
    category: "iq_math_word_problems",
    difficulty: "Medium",
    problemText: "Story: Mateo wants to build an awesome robot for the upcoming science fair. To make the robot, Mateo will use these solids: 3 cubes, 1 square prism, and 1 triangular pyramid.\nFacts: Mateo needs to buy plane figures to make the solids on his list. One cube has 6 square faces. One square prism has 2 square faces and 4 rectangular faces. One triangular pyramid has 4 triangular faces. The store sells a packet of 10 squares for $6, a packet of 4 rectangles for $2, a packet of 4 triangles for $4, and one single round button for $2.\nDetails: At the store, Mateo decides that it would be a cool idea to decorate the robot with some round buttons. He chooses exactly 6 round buttons for his robot.\nQuestion: How much will it cost to buy all the plane figures that Mateo needs to build the robot?",
    steps: [
      {
        id: "mwp_15_s1",
        prompt: "What do we need to find out in this situational problem?",
        options: [
          "The total cost to buy all the plane figures Mateo needs to build and decorate the robot",
          "How many cubes Mateo is using",
          "The cost of one single round button"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to find the total cost of all the shapes required."
      },
      {
        id: "mwp_15_s2",
        prompt: "What should be our first step?",
        options: [
          "Calculate how many squares and rectangles are needed for the cubes and the prism, and find their packet costs",
          "Subtract the rectangle cost from the square cost",
          "Calculate the button cost first"
        ],
        correctIndex: 0,
        explanation: "Exactly! Figuring out the number of squares and rectangles and their costs is a great place to start."
      },
      {
        id: "mwp_15_s3",
        prompt: "What's our second step?",
        options: [
          "Calculate how many triangles are needed for the pyramid and find their packet cost, and also calculate the cost of the buttons",
          "Multiply rectangles by buttons",
          "Add squares and rectangles together first"
        ],
        correctIndex: 0,
        explanation: "Correct! We need to calculate the cost for the triangles and the buttons next."
      },
      {
        id: "mwp_15_s4",
        prompt: "What's the last step to solve the problem?",
        options: [
          "Add up the costs of the squares, rectangles, triangles, and buttons to find the final price",
          "Subtract buttons from squares",
          "Divide the total cost by 4 shape types"
        ],
        correctIndex: 0,
        explanation: "Yes! Summing the costs of all components gives us the final price."
      },
      {
        id: "mwp_15_s5",
        prompt: "What would be the correct answer, buddy?\n\n(Use pen & paper if you need to write down the numbers)",
        options: [
          "$28",
          "$30",
          "$32"
        ],
        correctIndex: 1,
        explanation: "Correct! The total cost to build the robot is exactly $30. Outstanding job!"
      }
    ]
  }
];
