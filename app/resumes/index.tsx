import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  Platform,
  useWindowDimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown,
  SlideInRight,
  ZoomIn 
} from 'react-native-reanimated';

interface ResumeCard {
  id: string;
  name: string;
  role: string;
  lastUpdated: string;
  status: 'completed' | 'draft' | 'reviewing';
  gradient: readonly [string, string];
}

const userResumes: ResumeCard[] = [
  {
    id: '1',
    name: 'John Developer',
    role: 'Senior Software Engineer',
    lastUpdated: '2 days ago',
    status: 'completed',
    gradient: ['#4C6EF5', '#3B5BDB'] as const
  }
  ,{
    id: '2',
    name: 'John Designer',
    role: 'UI/UX Designer',
    lastUpdated: '5 days ago',
    status: 'draft',
    gradient: ['#339AF0', '#228BE6'] as const
  }
];

export default function ResumesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 bg-[#040B2C]">
      <LinearGradient
        colors={['#040B2C', '#0A1959', '#040B2C']}
        className="absolute inset-0"
      />

      {/* Decorative Background Elements */}
      <View className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500/20 blur-2xl" />
      <View className="absolute top-40 -left-20 w-40 h-40 rounded-full bg-indigo-500/20 blur-2xl" />
      <View className="absolute bottom-20 right-0 w-60 h-60 rounded-full bg-purple-500/10 blur-3xl" />

      <Animated.View 
        entering={FadeInDown.duration(1000)}
        className="flex-row items-center justify-between px-6 py-6"
      >
        <TouchableOpacity
          className="w-12 h-12 rounded-2xl border border-white/10 items-center justify-center bg-white/5 backdrop-blur-lg"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white tracking-wider">My Resumes</Text>
        <View className="w-12" />
      </Animated.View>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Create New Resume Card */}
        <Animated.View
          entering={ZoomIn.delay(200).duration(1000)}
          className="mb-8"
        >
          <TouchableOpacity
            onPress={() => router.push('/chat')}
            className="rounded-3xl overflow-hidden border border-white/10 backdrop-blur-lg"
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-8"
            >
              <View className="items-center">
                <View className="w-20 h-20 rounded-2xl bg-blue-500/20 items-center justify-center mb-4 border border-white/10">
                  <MaterialCommunityIcons name="plus" size={36} color="#60A5FA" />
                </View>
                <Text className="text-white font-bold text-2xl tracking-wide">
                  Create New Resume
                </Text>
                <Text className="text-blue-300/70 mt-2 text-center text-base">
                  Start from scratch or use a template
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Resume Cards */}
        <View className="space-y-6">
          {userResumes.map((resume, index) => (
            <Animated.View
              key={resume.id}
              entering={SlideInRight.delay(index * 200).duration(800)}
              className="backdrop-blur-lg"
              style={{ marginBottom: 20 }}
            >
              <TouchableOpacity
                onPress={() => router.push(`/templates`)}
                className="rounded-3xl overflow-hidden shadow-lg shadow-blue-500/20 border border-white/10"
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={resume.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-6"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-4">
                      <Text className="text-white font-bold text-2xl tracking-wide">
                        {resume.name}
                      </Text>
                      <Text className="text-white/90 mt-2 text-base">
                        {resume.role}
                      </Text>
                      <Text className="text-white/60 text-sm mt-3">
                        Last updated {resume.lastUpdated}
                      </Text>
                    </View>
                    <View className={`
                      px-4 py-2 rounded-2xl backdrop-blur-md
                      ${resume.status === 'completed' ? 'bg-green-500/30' : 
                        resume.status === 'draft' ? 'bg-yellow-500/30' : 
                        'bg-blue-500/30'}
                      border border-white/10
                    `}>
                      <Text className={`
                        text-sm font-medium tracking-wider
                        ${resume.status === 'completed' ? 'text-green-300' : 
                          resume.status === 'draft' ? 'text-yellow-300' : 
                          'text-blue-300'}
                      `}>
                        {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row mt-6 space-x-3">
                    {[
                      { icon: 'pencil' as const, route: '/settings' as const },
                      { icon: 'eye' as const, route: '/home' as const },
                      { icon: 'share-variant' as const, route: '/home' as const }
                    ].map((item, i) => (
                      <TouchableOpacity 
                        key={item.icon}
                        className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-lg"
                        onPress={() => router.push(item.route)}
                        activeOpacity={0.7}
                        style={{marginLeft: 5}}
                      >
                        <MaterialCommunityIcons 
                          name={item.icon} 
                          size={22} 
                          color="white" 
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}