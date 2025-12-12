import { motion } from 'framer-motion';
import { Image, Music, Type, ExternalLink, Heart, Download } from 'lucide-react';

export default function Credits() {
  const images = [
    {
      title: 'Cozy Reading Corner with Books',
      author: 'Jaredd Craig',
      source: 'Unsplash',
      url: 'https://unsplash.com/photos/HH4WBGNyltc',
      license: 'Unsplash License (Free to use)',
    },
    {
      title: 'Library Shelves with Books',
      author: 'Susan Q Yin',
      source: 'Unsplash',
      url: 'https://unsplash.com/photos/2JIvboGLeho',
      license: 'Unsplash License (Free to use)',
    },
    {
      title: 'Person Reading in Cozy Library',
      author: 'Blaz Photo',
      source: 'Unsplash',
      url: 'https://unsplash.com/photos/zMiHdExtcn8',
      license: 'Unsplash License (Free to use)',
    },
  ];

  const fonts = [
    {
      title: 'Inter',
      author: 'Rasmus Andersson',
      source: 'Google Fonts',
      url: 'https://fonts.google.com/specimen/Inter',
      license: 'SIL Open Font License',
    },
    {
      title: 'Playfair Display',
      author: 'Claus Eggers Sørensen',
      source: 'Google Fonts',
      url: 'https://fonts.google.com/specimen/Playfair+Display',
      license: 'SIL Open Font License',
    },
  ];

  const musicPlaceHolder = [
    {
      title: "Chopin - Nocturne in E Flat Major (Op. 9 No. 2)",
      author: "Rousseau",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=p29JUpsOSTE&list=RDp29JUpsOSTE&start_radio=1",
      license: "Royalty-Free Music"
    },
    {
      title: "Liszt - Liebestraum No. 3 (Love Dream)",
      author: "Rousseau",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=MBOa-2b4uQQ&list=RDMBOa-2b4uQQ&start_radio=1",
      license: "Royalty-Free Music"
    },
    {
      title: "Chopin – Waltz in A minor, B. 150, Op. Posth.",
      author: "Kassia",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=eN5z1mu6j4M&list=RDeN5z1mu6j4M&start_radio=1",
      license: "Royalty-Free Music"
    },
    {
      title: "Chopin - Nocturne Op. 55 No. 1",
      author: "Kassia",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=olFHFbijAjM&list=RDolFHFbijAjM&start_radio=1",
      license: "Royalty-Free Music"
    },
    {
      title: "Chopin - Nocturne in C Sharp Minor (No. 20)",
      author: "Rousseau",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=DqpPRj6UZqc&list=RDDqpPRj6UZqc&start_radio=1",
      license: "Royalty-Free Music"
    }
  ];

  return (
    <div className="relative min-h-screen py-20 px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-bg"></div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-4 rounded-2xl glass border border-primary/30 mb-6">
            <Heart className="w-10 h-10 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-5xl font-bold text-text mb-4">Credits & Attribution</h1>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            We're grateful to the talented creators whose work makes this project possible
          </p>
        </motion.div>

        {/* Images Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl glass border border-primary/20">
              <Image className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-text">Images</h2>
          </div>

          <div className="space-y-4">
            {images.map((item, index) => (
              <motion.div
                key={index}
                className="glass border border-primary/20 rounded-2xl p-6 hover:shadow-glow transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-light mb-2">
                      {item.title}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-text-dim">
                        <span className="text-text-light">Author:</span> {item.author}
                      </p>
                      <p className="text-text-dim">
                        <span className="text-text-light">Source:</span> {item.source}
                      </p>
                      <p className="text-text-dim">
                        <span className="text-text-light">License:</span> {item.license}
                      </p>
                    </div>
                  </div>
                  <motion.a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-primary/20 hover:border-primary/40 transition-colors text-primary font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>View</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Music Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl glass border border-primary/20">
              <Music className="w-6 h-6 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-text">Music</h2>
          </div>

          <div className="glass border border-primary/20 rounded-2xl p-6">
            <p className="text-text-light mb-4">
              Background music tracks for Reading Mode:
            </p>
            <div className="space-y-3">
              {musicPlaceHolder.map((item, index) => (
                <motion.div
                  key={index}
                  className="glass border border-primary/20 rounded-2xl p-4 hover:shadow-glow transition-all flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-text-light">{item.title}</p>
                    <div className="text-sm text-text-dim mt-1">
                      <p className="italic">{item.author} · {item.source}</p>
                      <p className="mt-1"><span className="text-text-light">License:</span> {item.license}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-primary/20 hover:border-primary/40 transition-colors text-primary font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>View</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-sm text-text-dim">
                <span className="font-semibold text-secondary">For Site Admin:</span> Music tracks are yet to be configured. Update the credits file once you add your background music.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Fonts Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl glass border border-primary/20">
              <Type className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-text">Fonts</h2>
          </div>

          <div className="space-y-4">
            {fonts.map((item, index) => (
              <motion.div
                key={index}
                className="glass border border-primary/20 rounded-2xl p-6 hover:shadow-glow transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-light mb-2">
                      {item.title}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-text-dim">
                        <span className="text-text-light">Author:</span> {item.author}
                      </p>
                      <p className="text-text-dim">
                        <span className="text-text-light">Source:</span> {item.source}
                      </p>
                      <p className="text-text-dim">
                        <span className="text-text-light">License:</span> {item.license}
                      </p>
                    </div>
                  </div>
                  <motion.a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-primary/20 hover:border-primary/40 transition-colors text-primary font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>View</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* License Info */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="glass border border-primary/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-text mb-4">License Information</h3>
            <div className="space-y-3 text-text-dim">
              <div>
                <span className="font-semibold text-text-light">Unsplash License:</span>{' '}
                Free to use for commercial and non-commercial purposes. No permission needed.
                Attribution appreciated but not required.
              </div>
              <div>
                <span className="font-semibold text-text-light">SIL Open Font License:</span>{' '}
                Fonts can be used, studied, modified and redistributed freely.
              </div>
              <div>
                <span className="font-semibold text-text-light">Royalty-Free:</span>{' '}
                Can be used without paying royalties, but check specific terms.
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer Note */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass border border-primary/20 rounded-2xl p-6 inline-block">
            <p className="text-text-dim text-sm mb-4">
              For complete attribution details and editable format:
            </p>
            <motion.a
              href="/credits.txt"
              download="credits.txt"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg gradient-primary text-white font-semibold shadow-medium hover:shadow-glow transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
              <span>Download credits.txt</span>
            </motion.a>
            <p className="text-text-dim text-xs mt-4">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
