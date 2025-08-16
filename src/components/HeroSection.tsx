import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users, DollarSign, Shield, Star, Instagram, CheckCircle } from 'lucide-react';
import logo from "../../public/iamgenes/la guaria letras amarilals fondo lguaria.jpg";
import auto from "../../public/iamgenes/auto.png";
import iphone from "../../public/iamgenes/iphonehero.png";




export default function HeroSection() {


  


  return (
    <div className="p-10 sm:p-10  dark:bg-gray-900 dark:text-white bg-white text-black flex items-center justify-center overflow-hidden relative" style={{backgroundImage: `url(${logo})`}}>
      {/* Overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
      
      <div className="w-full max-w-6xl px-4 sm:px-6 relative z-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center text-center md:text-left z-10">
            {/* Trust Badge */}
     
            <h1 className="text-4xl text-white sm:text-4xl md:text-5xl lg:text-8xl font-extrabold uppercase leading-tight tracking-tight">
              Gana <span className="text-yellow-500">Millones</span>
              <span className="block text-3xl md:text-4xl lg:text-6xl text-yellow-400 font-black">
                En Rifas Oficiales
              </span>
            </h1>
            
            <p className="mt-4 text-base sm:text-lg md:text-xl font-medium text-gray-300 text-balance">
            Participa en sorteos transparentes con premios garantizados y pagos inmediatos.
            </p>


            <div className="mt-6 sm:mt-8 flex flex-wrap gap-4">
              <a href="#participar" className="rounded-lg p-4 grow text-center bg-yellow-500 text-black font-bold uppercase text-sm tracking-widest hover:bg-yellow-600 transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                Participar Ahora
              </a>
              <a href="#como-funciona" className="rounded-lg p-4 grow border text-center border-yellow-500 text-yellow-500 font-bold uppercase text-sm tracking-widest hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                Cómo Funciona
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={24} />
                <span>Verificado</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500">
              <Star  size={24} />
                <span>+500 ganadores satisfechos.</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
              <Shield size={24} />
                <span>Pagos 100% seguros.</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center sm:m-10">
            <div className="absolute -top-10 md:-top-20 -left-10 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-yellow-500 rotate-12 rounded-lg border-yellow-700 border-b-4 border-r-8 max-sm:hidden opacity-90">
              <img src={auto} alt=""  className='p-1 rounded-xl'/>
            </div>
            
            <div className="relative z-10 bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-500/30 p-4 sm:p-6 -right-1/2 -translate-x-1/2 grow text-center shadow-2xl -rotate-2 rounded-xl text-nowrap border-slate-950 border-b-4 border-r-8 backdrop-blur-sm">
             
              
              <h2 className="text-2xl sm:text-3xl font-bold uppercase text-yellow-400 mb-2">
                Siguenos en instagram
              </h2>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase text-white mb-2">
                para ver los sorteos en vivo
              </h3>
  
              <a
                href="https://www.instagram.com/rifaslaguaira2025/"
                className="flex items-center justify-center gap-3  text-white hover:text-pink-400 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">

                  <Instagram size={16} className="text-white" />
                </div>
                <span className="text-xl">@rifaslaguaira2025</span>
              </a>
             
            </div>
            
            <div className="absolute -bottom-10 md:-bottom-20 -right-16 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-yellow-500 -rotate-12 rounded-lg border-yellow-700 border-r-4 border-b-8 max-sm:hidden opacity-90">
              <img src={iphone} alt=""  className='p-2 rounded-3xl
              '/>            </div>
          </div>
        </div>
      </div>
    </div>
  );
}