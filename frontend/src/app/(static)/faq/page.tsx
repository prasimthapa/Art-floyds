import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"

const qnas = [
  {
    q: "What is Art Floyd?",
    a: "Art Floyd is a platform where artists can share and sell their artworks.",
  },
  {
    q: "How can I sell my artwork?",
    a: "You can create an account, upload your artwork, and set your selling preferences.",
  },
]

export default function Page() {
  return <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-base text-indigo-600 dark:text-gray-300 font-semibold tracking-wide uppercase">Frequently Asked Questions</h2>
        <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl dark:text-white">
          Your Questions Answered
        </p>
      </div>

      <div className="mt-10">
        <Accordion type="single" collapsible className="w-full">
          {
            qnas.map(({ q, a }) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))
          }
        </Accordion>
      </div>
    </div>
  </section>
}
