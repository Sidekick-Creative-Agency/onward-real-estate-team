'use client'
import React, { useState, useRef, useCallback } from 'react'
import type { Form, Page } from '@/payload-types'
import { Media } from '@/components/Media'
import * as motion from 'motion/react-client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormBlock } from '@/blocks/Form/Component'

export const ResourcesHeroClient: React.FC<Omit<Page['hero'], 'type'> & { title: string } & { form: Form }> = ({
  media,
  enableOverrideTitle,
  overrideTitle,
  title,
  subtitle,
  form
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [guideName, setGuideName] = useState<'buyers' | 'sellers'>('buyers');

  // Keep the latest guideName readable inside the (stable) callbacks below.
  const guideNameRef = useRef(guideName);
  guideNameRef.current = guideName;

  const wrapperNodeRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  const applyGuideType = useCallback((node: HTMLElement) => {
    const input = node.querySelector<HTMLInputElement>('input[name="guide_type"]');
    if (!input || input.value === guideNameRef.current) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    nativeInputValueSetter?.call(input, guideNameRef.current);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, []);

  // Callback ref: fires exactly when the form wrapper attaches/detaches from the
  // DOM, so we never race the dialog's mount timing. While attached, a
  // MutationObserver re-applies the value whenever the guide_type input churns.
  const setFormWrapperRef = useCallback((node: HTMLDivElement | null) => {
    wrapperNodeRef.current = node;
    observerRef.current?.disconnect();
    if (!node) {
      observerRef.current = null;
      return;
    }
    applyGuideType(node);
    const observer = new MutationObserver(() => applyGuideType(node));
    observer.observe(node, { childList: true, subtree: true });
    observerRef.current = observer;
  }, [applyGuideType]);

  // Re-apply when the selected guide changes while the dialog is already open.
  const handleGuideClick = useCallback((name: 'buyers' | 'sellers') => {
    setGuideName(name);
    setIsOpen(true);
    guideNameRef.current = name;
    if (wrapperNodeRef.current) applyGuideType(wrapperNodeRef.current);
  }, [applyGuideType]);


  return (
    <div className="relative -mt-[125px] bg-brand-navy">
      <div className="container relative z-10 pt-40 pb-20 md:pt-48 md:pb-32">
        <div className="flex flex-col gap-16 md:gap-20">
          <div className="flex flex-col gap-4 md:gap-10 md:flex-row justify-between items-start md:items-center">
            <div className="flex-1">
              <motion.h1
                className="text-white text-[2.5rem] md:text-[4rem] leading-tight font-bold"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 'some', margin: '-128px 0px -16px 0px' }}
              >
                {enableOverrideTitle ? overrideTitle : title}
              </motion.h1>
            </div>
            <div className="flex-1 md:ml-auto md:max-w-[30rem]">
              <motion.p
                className="text-lg md:text-xl font-light text-white"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 'some', margin: '-128px 0px -16px 0px' }}
              >
                {subtitle}
              </motion.p>
            </div>
          </div>
          {media && typeof media === 'object' && (
            <div>
              <Media
                className="aspect-[4/5] md:aspect-[3/1] relative"
                imgClassName="object-cover absolute inset-0 w-full h-full"
                priority
                resource={media}
                size="100vw"
              />
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Button variant="secondary" onClick={() => handleGuideClick('buyers')}>Buyer's Guide</Button>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-brand-navy" onClick={() => handleGuideClick('sellers')}>Seller's Guide</Button>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-128 max-w-[calc(100%_-_2.5rem)]">
              <DialogHeader>
                <DialogTitle className="text-2xl">{guideName === 'buyers' ? "Buyer's" : "Seller's"} Guide</DialogTitle>
              </DialogHeader>
              <DialogDescription className="mb-4 text-brand-gray-04 font-light">
                Please fill out the form below to receive your free {guideName === 'buyers' ? "Buyer's" : "Seller's"} Guide.
              </DialogDescription>
              {form && typeof form === 'object' && (
                <div ref={setFormWrapperRef}>

                  <FormBlock
                    // @ts-expect-error type mismatch between form and footerContactForm
                    form={form}
                    styles={{ global: {}, resp: {} }}
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <img
        src="/pattern-geometric-general.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-brand-navy z-0" />
    </div>
  )
}
