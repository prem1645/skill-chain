'use client'

import { useEffect, useState } from 'react'

interface Quote {
  text: string
  author: string
}

const quotes: Quote[] = [
  {
    text: 'Dream, Dream, Dream. Dreams transform into thoughts and thoughts result in action.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Determination is the power that sees us through all our frustration and obstacles. It helps in building our willpower which is the very basis of success.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Failure will never overtake me if my determination to succeed is strong enough.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Be Active! Take on responsibility! Work for the things you believe in. If you do not, you are surrendering your fate to others.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'The best brains of the nation may be found on the last benches of the classroom.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Life is a difficult game. You can win it only by retaining your birthright to be a person.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'When you look at the light bulb above you, you remember Thomas Alva Edison. When the telephone bell rings, you remember Alexander Graham Bell. Marie Curie was the first woman to win the Nobel Prize. When you see the blue sky, you think of Sir C.V. Raman.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Dream is not that which you see while sleeping it is something that does not let you sleep.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'It Is Very Easy To Defeat Someone, But It Is Very Hard To Win Someone',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: "Don't take rest after your first victory because if you fail in the second, more lips are waiting to say that your first victory was just luck.",
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Thinking is the capital, Enterprise is the way, Hard Work is the solution',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Man needs difficulties in life because they are necessary to enjoy success.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Be active! Take on responsibility! Work for the things you believe in. If you do not, you are surrendering your fate to others.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Failure will never overtake me if my definition of success is strong enough.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'You see, God helps only people who work hard. That principle is very clear.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Building capacity dissolves differences. It irons out inequalities.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'We are all born with a divine fire in us. Our efforts should be to give wings to this fire and fill the world with the glow of its goodness.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Once your mind stretches to a new level it never goes back to its original dimension',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'To succeed in life and achieve results, you must understand and master three mighty forces— desire, belief, and expectation.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'If you want to leave your footprints On the sands of time Do not drag your feet.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'If you want to shine like a sun, first burn like a sun.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'To succeed in your mission, you must have single-minded devotion to your goal.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'A big shot is a little shot who keeps on shooting, so keep trying.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'The only true wisdom is in knowing you know nothing.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Those who cannot work with their hearts achieve but a hollow, half-hearted success that breeds bitterness all around.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'You have to dream before your dreams can come true.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Excellence is a continuous process and not an accident.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Let us sacrifice our today so that our children can have a better tomorrow.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'We should not give up and we should not allow the problem to defeat us.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Man needs his difficulties because they are necessary to enjoy success.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'As a child of God, I am greater than anything that can happen to me.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: "To become 'unique,' the challenge is to fight the hardest battle which anyone can imagine until you reach your destination.",
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'Small aim is a crime.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: 'India has to be transformed into a developed nation, a prosperous nation and a healthy nation, with a value system.',
    author: 'Dr. A P J Abdul Kalam',
  },
  {
    text: "Don't compare yourself with others, No one can play your role better than you.",
    author: 'Dr. A P J Abdul Kalam',
  },
]

export default function RandomQuote() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }, [])

  // Show a default quote during SSR to prevent hydration mismatch
  const displayQuote = currentQuote || quotes[0]

  return (
    <blockquote className='space-y-6'>
      <p className='text-3xl font-bold leading-[150%] text-white'>
        &ldquo;{displayQuote.text}&rdquo;
      </p>
      <footer className='font-mono text-lg font-semibold text-white'>
        ~ {displayQuote.author}
      </footer>
    </blockquote>
  )
}
