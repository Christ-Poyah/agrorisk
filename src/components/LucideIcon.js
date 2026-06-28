import React from 'react';
import {
  Sun, Droplets, Bug, Thermometer, Wind, CloudRain, CloudSun,
  MapPin, Calendar, Maximize2, Shield, ShieldCheck, Zap,
  TrendingUp, TrendingDown, Minus, ChevronRight, ArrowLeft,
  Plus, CheckCircle2, AlertTriangle, Info, BarChart3, Bot,
  Settings, LogOut, Phone, Search, Bell, Home, Leaf, User,
  Satellite, Lock, CreditCard, HelpCircle, Globe, Eye,
  Check, X, ChevronDown, ChevronUp, Layers, Activity,
  Mic, ImagePlus, ArrowUp, Square, Loader,
  Smartphone, Building2, Wallet, Navigation2,
} from 'lucide-react-native';

const ICONS = {
  Sun, Droplets, Bug, Thermometer, Wind, CloudRain, CloudSun,
  MapPin, Calendar, Maximize2, Shield, ShieldCheck, Zap,
  TrendingUp, TrendingDown, Minus, ChevronRight, ArrowLeft,
  Plus, CheckCircle2, AlertTriangle, Info, BarChart3, Bot,
  Settings, LogOut, Phone, Search, Bell, Home, Leaf, User,
  Satellite, Lock, CreditCard, HelpCircle, Globe, Eye,
  Check, X, ChevronDown, ChevronUp, Layers, Activity,
  Mic, ImagePlus, ArrowUp, Square, Loader,
  Smartphone, Building2, Wallet, Navigation2,
};

export default function Icon({ name, size = 20, color = '#18181A', strokeWidth = 1.75 }) {
  const Component = ICONS[name];
  if (!Component) return null;
  return <Component size={size} color={color} strokeWidth={strokeWidth} />;
}
