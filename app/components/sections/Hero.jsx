import {Button} from "@/app/components/ui/Button";
import {ArrowRight, Star, Sparkles, Truck, Shield, Award} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Star className="w-4 h-4 text-primary fill-current" />
              <span className="text-sm text-primary font-semibold">
                New Collection 2024
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary leading-tight">
                Shop Smart,
                <span className="block text-primary">Live Better.</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover premium products that enhance your lifestyle. From
                cutting-edge electronics to trendy fashion - find everything you
                need.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary-hover text-text-inverse px-8 py-4 rounded-full font-medium transition-all hover:scale-105 group">
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/orders">
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-text-inverse px-8 py-4 rounded-full font-medium transition-all"
                >
                  Track Orders
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">
                  100K+
                </div>
                <div className="text-sm text-text-muted">Happy Customers</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">50+</div>
                <div className="text-sm text-text-muted">Countries</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary">4.9★</div>
                <div className="text-sm text-text-muted">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Visual - Logo as Main Circle */}
          <div className="relative">
            <div className="aspect-square relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/20 border border-primary/10">
              {/* Main Brand Logo - Replace Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Logo as Main Circle - No Background Container */}
                  <div className="relative">
                    {/* Your Logo Circle */}
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                      <Image
                        src="/daarn.png"
                        alt="Daarns Logo"
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Optional: Brand Name Below Logo */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-2xl font-bold text-primary tracking-tight drop-shadow-lg">
                        Daarns
                      </span>
                    </div>
                  </div>

                  {/* Floating Sparkles Around Logo */}
                  <Sparkles className="absolute -top-8 -right-8 w-8 h-8 text-accent animate-pulse" />
                  <Sparkles
                    className="absolute -bottom-6 -left-6 w-6 h-6 text-primary animate-pulse"
                    style={{animationDelay: "1s"}}
                  />
                  <Sparkles
                    className="absolute top-12 -left-12 w-4 h-4 text-accent animate-pulse"
                    style={{animationDelay: "2s"}}
                  />
                  <Sparkles
                    className="absolute bottom-16 right-12 w-5 h-5 text-primary animate-pulse"
                    style={{animationDelay: "0.5s"}}
                  />
                </div>
              </div>

              {/* Brand Benefits - Positioned Around Logo */}
              <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border animate-float">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm text-text-primary font-medium">
                    Premium Quality
                  </span>
                </div>
              </div>

              <div
                className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border animate-float"
                style={{animationDelay: "1s"}}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Truck className="w-4 h-4 text-primary" />
                  <div className="text-lg font-bold text-primary">
                    Free Shipping
                  </div>
                </div>
                <div className="text-sm text-text-secondary">
                  On orders over Rp 500K
                </div>
              </div>

              <div
                className="absolute top-1/2 left-6 bg-background/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border animate-float"
                style={{animationDelay: "2s"}}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span className="text-sm text-text-primary font-medium">
                    Secure Payment
                  </span>
                </div>
              </div>

              {/* Background Pattern - Subtle */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-accent/5 to-transparent rounded-tr-full"></div>
    </section>
  );
}
