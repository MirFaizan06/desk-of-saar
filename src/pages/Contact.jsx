import { motion } from 'framer-motion';
import { Mail, Phone, Twitter, Instagram, Linkedin, Github, Send } from 'lucide-react';
import { contactInfo } from '../data/contact';

const iconMap = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github
};

export default function Contact() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass px-6 py-2 rounded-full mb-6 border border-blue/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Send className="w-5 h-5 text-blue" />
            <span className="text-text font-medium">Get in Touch</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
            Let's Connect
            <br />
            <span className="gradient-text">We'd Love to Hear From You</span>
          </h1>

          <p className="text-xl text-text-dim max-w-2xl mx-auto">
            Have questions, suggestions, or just want to say hello? Reach out through any of these channels.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            className="glass rounded-3xl p-10 border border-blue/20"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue/30">
              <Mail className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-text mb-3">Email me</h2>
            <p className="text-text-dim mb-4">
              Send me an email and we'll get back to you as soon as possible.
            </p>

            <motion.a
              href={`mailto:${contactInfo.email}`}
              className="text-blue font-semibold text-lg hover:text-blue-light transition-colors inline-block"
              whileHover={{ x: 5 }}
            >
              {contactInfo.email}
            </motion.a>
          </motion.div>

          <motion.div
            className="glass rounded-3xl p-10 border border-blue/20"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-16 h-16 gradient-secondary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-orange/30">
              <Phone className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-text mb-3">Call Us</h2>
            <p className="text-text-dim mb-4">
              Prefer to talk? Give us a call during business hours.
            </p>

            <motion.a
              href={`tel:${contactInfo.phone}`}
              className="text-orange font-semibold text-lg hover:text-orange-light transition-colors inline-block"
              whileHover={{ x: 5 }}
            >
              {contactInfo.phone}
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="glass rounded-3xl p-10 border border-blue/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-text mb-6 text-center">Follow Us</h2>
          <p className="text-text-dim text-center mb-8">
            Stay updated with my latest additions and announcements on social media.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactInfo.socials.map((social, index) => {
              const Icon = iconMap[social.icon];

              return (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-dark rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue border border-blue/20 transition-all group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue/50 transition-shadow">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-text font-medium">{social.name}</span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-text-dim">
            I typically respond within 24-48 hours.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
