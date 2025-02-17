'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Music4, Shuffle, ListMusic, ArrowRight, Wand2, Twitter as TwitterIcon, Github as GithubIcon, Heart as HeartIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCountUp } from '@/hooks/useCountUp'
import ScrollTracker from '@/components/ScrollTracker';

const stats = [
  { value: 500, label: 'Songs Organized', prefix: '+' },
  { value: 100, label: 'Active Users', prefix: '+' },
  { value: 1000, label: 'Setlists Created', prefix: '+' },
  { value: 4.9, label: 'Average Rating', decimals: 1 },
];

// Discord Icon Component
const DiscordIcon = (props: any) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
)

// Sortable Song Component
function SortableSong({ song, id }: { song: string; id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 rounded-lg bg-gray-700/50 backdrop-blur-sm border border-gray-600 cursor-move
        ${isDragging ? 'shadow-lg ring-2 ring-blue-500/20' : ''}`}
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-3">
        <Music4 className="h-5 w-5 text-blue-400" />
        <span className="text-gray-200">{song}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">
          Drag to reorder
        </div>
      </div>
    </motion.div>
  );
}

// Dragging Song Component
function DraggingSong({ song }: { song: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 backdrop-blur-sm border border-gray-600 shadow-lg ring-2 ring-blue-500/20">
      <div className="flex items-center gap-3">
        <Music4 className="h-5 w-5 text-blue-400" />
        <span className="text-gray-200">{song}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">
          Drag to reorder
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [songs, setSongs] = useState([
    'Way Maker',
    'How Great is Our God',
    'Build My Life',
  ]);
  const [activeSong, setActiveSong] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveSong(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveSong(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSongs((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ScrollTracker />
      
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => router.push('/')}
              className="font-space text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              guidefy
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Why Guidefy', href: '#why-guidefy' },
                { label: 'Workflow', href: '#workflow' },
                { label: 'Get Started', href: '#get-started' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.querySelector(item.href)
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/login')}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/register')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started - $2.99/mo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left relative z-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 mb-6">
                <Wand2 className="h-4 w-4" />
                <span className="text-sm font-medium">Simplify your music direction</span>
              </div>
              
              <h1 className="font-space text-5xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Lead your band
                </span>
                {' '}
                <br className="hidden lg:block" />
                with confidence
              </h1>

              <p className="text-gray-400 text-lg lg:text-xl mb-8 max-w-lg">
                Stop struggling with setlist organization. Guidefy helps music directors 
                create and modify song sequences in seconds, so you can focus on what 
                matters: <span className="font-semibold">making great music</span>.
              </p>

              {/* Quick Benefits */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                {[
                  { icon: <Shuffle className="h-5 w-5" />, text: "Instant song reordering" },
                  { icon: <Music4 className="h-5 w-5" />, text: "Quick setlist creation" },
                ].map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 text-gray-400 justify-center sm:justify-start"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      {benefit.icon}
                    </div>
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Interactive Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 hidden lg:block"
            >
              <div className="relative rounded-xl bg-gray-800/50 backdrop-blur-sm p-8 shadow-2xl border border-gray-700">
                <div className="absolute top-4 left-4 flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>

                <div className="mt-8 space-y-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={songs}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence>
                        {songs.map((song) => (
                          <SortableSong key={song} id={song} song={song} />
                        ))}
                      </AnimatePresence>
                    </SortableContext>

                    <DragOverlay>
                      {activeSong ? (
                        <DraggingSong song={activeSong} />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute -right-4 -top-4 h-24 w-24 rounded-xl bg-blue-500/10 backdrop-blur-sm"
              />
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute -left-4 bottom-4 h-20 w-20 rounded-xl bg-purple-500/10 backdrop-blur-sm"
              />
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900 to-purple-900/20" />
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Why Guidefy Section - Agora vem primeiro */}
      <section id="why-guidefy" className="py-24 relative">
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 mb-6">
              <Music4 className="h-4 w-4" />
              <span className="text-sm font-medium">Made for Music Directors</span>
            </div>
            
            <h2 className="font-space text-4xl lg:text-5xl font-bold mb-6">
              Why choose
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent ml-2">
                Guidefy?
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built specifically for music directors who need quick, efficient setlist management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡️",
                title: "Lightning Fast",
                description: "Reorganize your setlist in seconds with intuitive drag and drop",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: "🎯",
                title: "Stay Focused",
                description: "Clear interface shows exactly what's coming next in your setlist",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                icon: "🎹",
                title: "Music-First Design",
                description: "Created specifically for the needs of music directors",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: "🔄",
                title: "Quick Changes",
                description: "Make last-minute setlist changes without stress or confusion",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: "👥",
                title: "Team Friendly",
                description: "Keep your whole band on the same page with shared setlists",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: "💡",
                title: "Intuitive Interface",
                description: "No learning curve - start organizing setlists immediately",
                gradient: "from-red-500 to-orange-500"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-4xl">{benefit.icon}</div>
                  <h3 className={`font-space text-xl font-bold mb-2 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity bg-gradient-to-r ${benefit.gradient}`}
                      style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                      >
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {benefit.description}
                  </p>
                </div>
                
                <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl ${benefit.gradient}`}
                     style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-blue-500/5 blur-3xl rounded-full" />
          <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-purple-500/5 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Workflow Section - Agora vem depois */}
      <section id="workflow" className="py-24 relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 mb-6">
              <Shuffle className="h-4 w-4" />
              <span className="text-sm font-medium">Streamlined Workflow</span>
            </div>
            
            <h2 className="font-space text-4xl lg:text-5xl font-bold mb-6">
              Focus on what matters:
              <span className="block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Making great music
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stop wasting time with complicated setlist management. 
              Guidefy simplifies your workflow so you can focus on leading your band.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ListMusic className="h-6 w-6" />,
                title: "Create Setlists",
                description: "Quickly add songs to your setlist with our intuitive interface",
                delay: 0,
              },
              {
                icon: <Shuffle className="h-6 w-6" />,
                title: "Reorder Instantly",
                description: "Drag and drop to reorganize your setlist in seconds",
                delay: 0.2,
              },
              {
                icon: <Music4 className="h-6 w-6" />,
                title: "Lead Confidently",
                description: "Always know what's coming next in your setlist",
                delay: 0.4,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: step.delay }}
                viewport={{ once: true }}
                className="relative p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-space text-xl font-bold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-purple-500/5 blur-3xl rounded-full" />
          <div className="absolute left-0 top-0 w-1/3 h-1/3 bg-blue-500/5 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Stats Section with CTA */}
      <section id="get-started" className="py-24 relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32"
          >
            {stats.map((stat, index) => {
              const value = useCountUp(stat.value)
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="font-space text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.prefix || ''}{stat.decimals ? value.toFixed(stat.decimals) : Math.round(value)}
                  </div>
                  <div className="text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Final CTA */}
          <motion.div className="relative rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-gray-800 p-8 md:p-12 lg:p-16 overflow-hidden">
            <div className="relative z-20 max-w-3xl mx-auto text-center">
              <h2 className="font-space text-4xl lg:text-5xl font-bold mb-6">
                Ready to transform your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  music direction?
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join music directors who are already using Guidefy to lead their bands with confidence.
                <span className="block mt-2 text-blue-400">Just $2.99/month - no hidden fees.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/register')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  size="lg"
                  className="text-gray-900 border-gray-700 hover:bg-gray-300 text-lg px-8"
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/10 blur-3xl rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/10 blur-3xl rounded-full"
            />
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute right-0 top-0 w-1/3 h-1/3 bg-blue-500/5 blur-3xl rounded-full" />
          <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-purple-500/5 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="font-montserrat text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need for efficient music direction, from planning to execution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-gray-900"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Logo + Description */}
            <div className="space-y-4">
              <h3 className="font-space text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                guidefy
              </h3>
              <p className="text-gray-400 text-sm">
                Empowering music directors with intelligent setlist management.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-space text-sm font-semibold text-gray-300 mb-4">
                Product
              </h4>
              <ul className="space-y-2">
                {[
                  'Features',
                  'Pricing',
                  'Sign Up',
                  'Sign In'
                ].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => router.push(`/${item.toLowerCase().replace(' ', '-')}`)}
                      className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-space text-sm font-semibold text-gray-300 mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                {[
                  'Privacy Policy',
                  'Terms of Service',
                  'Cookie Policy'
                ].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => router.push(`/${item.toLowerCase().replace(' ', '-')}`)}
                      className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-space text-sm font-semibold text-gray-300 mb-4">
                Connect
              </h4>
              <div className="flex space-x-4">
                {[
                  { icon: 'twitter', url: 'https://twitter.com' },
                  { icon: 'github', url: 'https://github.com' },
                  { icon: 'discord', url: 'https://discord.com' }
                ].map((social) => (
                  <a
                    key={social.icon}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <span className="sr-only">{social.icon}</span>
                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      {social.icon === 'twitter' && <TwitterIcon className="h-4 w-4" />}
                      {social.icon === 'github' && <GithubIcon className="h-4 w-4" />}
                      {social.icon === 'discord' && <DiscordIcon className="h-4 w-4" />}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 mt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Guidefy. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Made with</span>
                <HeartIcon className="h-4 w-4 text-red-500" />
                <span>by music directors for music directors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute right-0 bottom-0 w-1/4 h-1/4 bg-blue-500/5 blur-3xl rounded-full" />
          <div className="absolute left-0 top-0 w-1/4 h-1/4 bg-purple-500/5 blur-3xl rounded-full" />
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'Quick Creation',
    description: 'Build your setlists in seconds with our intuitive interface',
    icon: '🎵'
  },
  {
    title: 'Easy Editing',
    description: 'Drag and drop to effortlessly reorganize your songs',
    icon: '✨'
  },
  {
    title: 'Total Organization',
    description: 'Keep all your setlists organized in one place',
    icon: '📋'
  }
];
