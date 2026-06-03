export const works = [
  {
    id: 1,
    title: 'The Amber Meridian',
    category: 'novel',
    year: '1889',
    pages: 312,
    status: 'published',
    description: 'A gothic novel tracing three generations of a coastal family who built their fortune on something they refused to name. The original manuscript was found handwritten in two different hands. No explanation has been offered.',
    excerpt: '"The light came not from any star, but from something older — something that had learned, long ago, to imitate the sky."',
  },
  {
    id: 2,
    title: 'Salt & Silence',
    category: 'poetry',
    year: 'The Third Winter',
    pages: 88,
    status: 'published',
    description: 'Forty-three poems, each dated not by year but by season and feeling. The handwriting grows steadily smaller toward the end, as though the writer was trying to fit everything into the remaining space.',
    excerpt: '"You left the door open — not as invitation but as confession."',
  },
  {
    id: 3,
    title: 'The Cartographer\'s Wife',
    category: 'short story',
    year: '1901',
    pages: 28,
    status: 'published',
    description: 'A woman inherits her late husband\'s collection of maps. None of them lead anywhere recognizable. All of them are marked with the same note in the margins: here be grief.',
    excerpt: '"Here be grief, he had written, in his careful hand, and she had understood, finally, that all maps are confessions."',
  },
  {
    id: 4,
    title: 'The Inland Sea',
    category: 'novel',
    year: 'Unfinished',
    pages: null,
    status: 'draft',
    description: 'The unfinished fourth work. Forty pages exist. The rest of the manuscript was either never written or deliberately destroyed. The forty pages end mid-sentence.',
    excerpt: '"He had come this far — further than sense allowed — and the water was still —"',
  },
]

export const journalEntries = [
  {
    id: 1,
    title: 'On Beginning',
    category: 'Craft',
    date: 'March 3, 1884',
    excerpt: 'Every work begins the same way. With a sentence that arrives without permission. You write it down not because you chose to but because the alternative is carrying it forever.',
    body: `Every work begins the same way. With a sentence that arrives without permission. You write it down not because you chose to but because the alternative is carrying it forever.

I have been carrying the first sentence of the new novel for eleven months. This morning I wrote it down. I am not relieved. I am terrified. It is one thing to carry a sentence. It is another to be responsible for everything that follows it.

The sentence is: The light came not from any star.

I do not yet know what comes after. I suspect it will tell me.`,
    readTime: '3 min',
  },
  {
    id: 2,
    title: 'The House on the Meridian',
    category: 'Place',
    date: 'July 14, 1886',
    excerpt: 'I found the house by walking in the wrong direction for long enough that the wrong direction became the only direction. It was larger inside than outside. I did not find this strange until later.',
    body: `I found the house by walking in the wrong direction for long enough that the wrong direction became the only direction. It was larger inside than outside. I did not find this strange until later.

The previous occupant had left everything. Books still open. A fire that had burned down to nothing but retained, somehow, its warmth. A clock on the mantle that showed the correct time though no one had wound it.

I stayed one night. That was in 1886. I have not left.

I have stopped questioning what the house wants from me. I have begun, instead, to give it what I can.`,
    readTime: '4 min',
  },
  {
    id: 3,
    title: 'What the Archive Is For',
    category: 'Research',
    date: 'November 9, 1891',
    excerpt: 'I have been asked, twice now, why I keep everything. Letters, receipts, maps of places I have never been. I keep them because someone should.',
    body: `I have been asked, twice now, why I keep everything. Letters, receipts, maps of places I have never been. I keep them because someone should.

There is a kind of grief that has no object. You feel it for things that were lost before you arrived. For the people who didn't make it to the part of the story where things got better. For the sentences that were never written down.

The archive is for them. Not for me.

I am only the custodian. When I am gone, someone else will be. That is the arrangement. I did not make it but I have agreed to it.`,
    readTime: '3 min',
  },
]

export const featuredWorks = works.filter(w => w.status === 'published').slice(0, 3)
