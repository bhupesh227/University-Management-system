"use client";
import React from 'react';
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
import { cn } from '@/lib/utils';
import BookCoverSvg from './BookCoverSvg';

type BookCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const varientStyles: Record<BookCoverVariant, string> = {                   // Record is a utility type that creates an object type whose property keys are Keys and whose property values are Type.
    extraSmall:'book-cover_extra_small',
    small: 'book-cover_small',
    medium: 'book-cover_medium',
    regular: 'book-cover_regular',
    wide: 'book-cover_wide',
};
interface Props {
    className?: string;
    variant?: BookCoverVariant;
    coverColor: string;
    coverImage: string;
}

const BookCover = ({
    className, 
    variant ="regular",                                             // default variant
    coverColor= "#012B48",                                               // default color
    coverImage= "https://placehold.co/400x600.png",             // default image
}:Props) => {
  return (
    <div className={cn(
        'relative transaction-all duration-300',
        varientStyles[variant],
        className,
    )}>
        <BookCoverSvg coverColor={coverColor}/>
        <div className='absolute z-10' style={{left:'12%',width:'87.5%', height:'88%'}}>
            <IKImage
                path={coverImage}
                urlEndpoint={config.env.imagekit.urlEndpoint}
                alt="Book cover"
                fill
                className="rounded-sm object-fill"
                loading="lazy"
                lqip={{ active: true }}
            />
        </div>
    </div>
  );
};

export default BookCover