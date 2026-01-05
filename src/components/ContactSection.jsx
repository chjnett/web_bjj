import ScrollRevealItem from './ScrollRevealItem'

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-max">
        {/* Section Title */}
        <ScrollRevealItem className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">문의하기</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700">
            궁금하신 점이 있으시면 언제든지 문의해주세요
          </p>
        </ScrollRevealItem>
      </div>
    </section>
  )
}

export default ContactSection
