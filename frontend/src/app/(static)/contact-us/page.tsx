export default function Page() {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
    <div className="text-center">
      <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase dark:text-gray-300">Get in Touch</h2>
      <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl dark:text-white">
        Reach Out to Us
      </p>
    </div>
    <div className="mt-10 flex flex-col items-center justify-center">
      <p className="text-lg text-gray-500">
        If you have any questions or need assistance, feel free to contact us.
      </p>
      <div className="mt-6">
        <a href="mailto:contact@artfloyd.com?subject=Inquiry%20from%20Art%20Floyd%20Website" className="inline-block bg-indigo-600 text-white rounded-md px-6 py-3 text-lg font-medium hover:bg-indigo-700">
          Email Us
        </a>
        <a href="tel:+9779808035018" className="inline-block bg-gray-200 text-indigo-600 rounded-md px-6 py-3 text-lg font-medium hover:bg-gray-300 ml-4">
          Call Us
        </a>
      </div>
    </div>
  </div>
}
