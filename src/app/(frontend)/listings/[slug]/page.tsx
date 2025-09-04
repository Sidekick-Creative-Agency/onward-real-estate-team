import type { Metadata } from "next";

import { RelatedPosts } from "@/blocks/RelatedPosts/Component";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { draftMode } from "next/headers";
import React, { cache } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import type {
	Attachment,
	Post,
	PropertyType,
	TeamMember,
} from "@/payload-types";

import { generateMeta } from "@/utilities/generateMeta";
import PageClient from "./page.client";
import { CopyButton } from "@/components/CopyButton";
import { FloorPlanIcon } from "@/app/(frontend)/listings/map/page.client";
import {
	faBath,
	faBedFront,
	faFarm,
	faFilePdf,
} from "@awesome.me/kit-a7a0dd333d/icons/sharp-duotone/thin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import RichText from "@/components/RichText";
import { formatPrice } from "@/utilities/formatPrice";
import { formatNumber } from "@/utilities/formatNumber";
import {
	faChevronDown,
	faChevronUp,
	faImage,
	faChevronLeft,
} from "@awesome.me/kit-a7a0dd333d/icons/sharp/light";
import { ListingMap } from "@/components/Map/Individual";
import { ArchiveBlock } from "@/blocks/ArchiveBlock/Component";
import { Media } from "@/components/Media";
import { Button } from "@/components/ui/button";
import { Media as MediaType } from "@/payload-types";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { notFound, redirect } from "next/navigation";
import { FormBlock } from "@/blocks/Form/Component";
import Image from "next/image";
import Link from "next/link";
import AutoHeight from "embla-carousel-auto-height";
import { ImageGallery } from "@/components/Listings/ImageGallery";

export const revalidate = 3600;
export const dynamicParams = true;

// export async function generateStaticParams() {
//   const payload = await getPayload({ config: configPromise })
//   const listings = await payload.find({
//     collection: 'listings',
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//     select: {
//       slug: true
//     },
//     where: {
//       _status: {
//         equals: 'published'
//       }
//     }
//   })
//   const params = listings.docs.map(({ slug }) => {
//     return { slug: String(slug) }
//   })
//   return params
// }

type Args = {
	params: Promise<{
		slug?: string;
	}>;
};

export default async function Listing({ params: paramsPromise }: Args) {
	const { slug = "" } = await paramsPromise;
	const url = "/listings/" + slug;
	const listing = await queryListingBySlug({ slug });
	const payload = await getPayload({ config: configPromise });

	const footerContactForm = await payload.findByID({
		collection: "forms",
		id: 1,
	});
	const sidebarForm = await payload.findByID({
		collection: "forms",
		id: 5,
	});

	if (!listing) return <PayloadRedirects url={url} />;

	return (
		<article>
			<PageClient />

			{/* Allows redirects for valid pages too */}
			<PayloadRedirects disableNotFound url={url} />
			<div className="bg-white pt-10 pb-20">
				<div className="container flex flex-col gap-10">
					<Button
						variant={"link"}
						className="w-auto p-0 text-brand-gray-03 flex gap-2 items-center leading-none hover:no-underline focus-visible:no-underline hover:text-brand-gray-06 focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2 focus-visible:text-brand-gray-06"
						asChild
					>
						<Link href="/listings/map" className="w-fit">
							<FontAwesomeIcon icon={faChevronLeft} className="w-2 h-auto" />
							Back to Search
						</Link>
					</Button>
					<div className="flex flex-col md:flex-row justify-between gap-10">
						<div className="flex flex-col gap-2 md:gap-6">
							<div className="flex gap-x-4 gap-y-0 flex-wrap text-base text-brand-gray-03 uppercase tracking-wider font-bold">
								<span>{listing.transactionType}</span>|
								<span>
									{listing.category === "commercial"
										? listing.propertyType &&
											typeof listing.propertyType === "object" &&
											listing.propertyType.map((propertyType, index) => {
												if (listing.propertyType) {
													return index !== listing.propertyType.length - 1
														? `${(propertyType as PropertyType).title}, `
														: (propertyType as PropertyType).title;
												}
												return "";
											})
										: "Residential"}
								</span>
							</div>
							<div className="max-w-3xl md:flex md:gap-4 md:items-center">
								<h1 className="text-[2.5rem] font-bold text-brand-navy leading-tight whitespace-pre-wrap  hidden md:block">
									{listing.title}
								</h1>
								<span className="text-[2.5rem] font-bold text-brand-navy leading-tight md:hidden">
									{typeof listing.price === "number" && listing.price !== 0
										? formatPrice(listing.price)
										: "Contact for price"}
								</span>
								{typeof listing.price === "number" &&
									listing.textAfterPrice && (
										<span className=" inline md:hidden ml-2">
											{listing.textAfterPrice}
										</span>
									)}
								{listing.availability && (
									<div className="py-[.6rem] px-3 rounded-lg bg-brand-blue bg-opacity-50 leading-none hidden md:block">
										<span className="text-xs font-bold text-brand-navy tracking-wider leading-none uppercase">
											{listing.availability}
										</span>
									</div>
								)}
							</div>
							<h1 className="text-xl font-light text-brand-gray-03 block md:hidden">
								{listing.title}
							</h1>
							<span className="text-lg font-light text-brand-gray-03 inline-block">
								{listing.streetAddress}, {listing.city}, {listing.state}{" "}
								{listing.zipCode}
							</span>
						</div>
						<div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4">
							<div className="hidden md:block">
								<span className="text-3xl md:text-[2.5rem] font-bold text-brand-navy hidden md:inline-block text-right">
									{typeof listing.price === "number" && listing.price !== 0
										? formatPrice(listing.price)
										: "Contact for price"}
								</span>
								{typeof listing.price === "number" &&
									listing.textAfterPrice && (
										<span className="hidden md:inline ml-2">
											{listing.textAfterPrice}
										</span>
									)}
							</div>

							{listing.availability && (
								<div className="py-2 px-3 rounded-lg bg-brand-blue bg-opacity-50 block md:hidden">
									<span className="text-xs font-bold text-brand-navy tracking-wider uppercase">
										{listing.availability}
									</span>
								</div>
							)}
							<CopyButton
								value={`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}${url}`}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative h-fit">
						<Media
							resource={listing.featuredImage}
							className={`${(!listing.imageGallery || listing.imageGallery.length === 0) && (!listing.MLS?.ImageGalleryUrls || listing.MLS?.ImageGalleryUrls.length === 0) ? "col-span-full" : "col-span-2 sm:col-span-2"} row-span-1 sm:row-span-2 relative aspect-[3/2] `}
							imgClassName="absolute top-0 left-0 w-full h-full object-cover"
							priority
						/>
						{listing.imageGallery && listing.imageGallery.length > 1 && (
							<>
								<Media
									resource={
										listing?.imageGallery[0]?.image as
											| MediaType
											| number
											| undefined
									}
									className={`col-span-1 aspect-[3/2] sm:aspect-auto ${listing.imageGallery.length > 1 ? "row-span-1" : "row-span-2"} relative`}
									imgClassName="absolute top-0 left-0 w-full h-full object-cover"
									priority
								/>
								{listing.imageGallery.length > 1 && (
									<Media
										resource={
											listing.imageGallery[1].image as
												| MediaType
												| number
												| undefined
										}
										className="col-span-1 row-span-1 relative aspect-[3/2] sm:aspect-auto"
										imgClassName="absolute top-0 left-0 w-full h-full object-cover"
										priority
									/>
								)}
							</>
						)}
						{(!listing.imageGallery || listing.imageGallery.length === 0) &&
							listing.MLS?.ImageGalleryUrls &&
							listing.MLS?.ImageGalleryUrls.length > 0 && (
								<>
									<div
										className={`col-span-1 aspect-[3/2] sm:aspect-auto ${listing.MLS.ImageGalleryUrls.length > 1 ? "row-span-1" : "row-span-2"} relative`}
									>
										<Image
											src={listing.MLS?.ImageGalleryUrls[0].url || ""}
											alt=""
											fill
											className="object-cover"
										/>
									</div>
									{listing.MLS.ImageGalleryUrls.length > 1 && (
										<div className="col-span-1 row-span-1 relative aspect-[3/2] sm:aspect-auto">
											<Image
												src={listing.MLS?.ImageGalleryUrls[1].url || ""}
												alt=""
												fill
												className="object-cover"
											/>
										</div>
									)}
								</>
							)}
						<Dialog>
							<DialogTrigger asChild>
								<Button
									size={"icon"}
									className="absolute bottom-2 right-2 z-10 w-12 h-12 p-3 rounded-md border-none bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-50 focus-visible:bg-white focus-visible:bg-opacity-50 backdrop-blur-sm"
								>
									<FontAwesomeIcon
										icon={faImage}
										className="w-full h-auto"
										style={{ width: "100%" }}
									/>
								</Button>
							</DialogTrigger>
							<DialogContent className="w-[80rem] max-w-[calc(100vw-2.5rem)] md:max-w-[calc(100vw-5rem)] max-h-[calc(100vh-2.5rem)] p-0 bg-transparent justify-stretch h-auto">
								<DialogTitle hidden>Image Gallery</DialogTitle>
								{listing.imageGallery && listing.imageGallery.length !== 0 ? (
									<ImageGallery
										imageGallery={[
											listing.featuredImage,
											...(listing.imageGallery.map((item) => item.image) as (
												| MediaType
												| number
											)[]),
										]}
									/>
								) : (
									<ImageGallery
										imageGallery={[
											listing.featuredImage,
											...(listing.MLS?.ImageGalleryUrls?.map(
												(item) => item.url,
											) as string[]),
										]}
									/>
								)}
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
			<div className="bg-brand-offWhite py-20">
				<div className="container">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
						<div className="col-span-1 lg:col-span-2 p-4 py-10 sm:p-10 bg-white border-t-[10px] border-brand-navy flex flex-col">
							<div className="pb-10 flex flex-col sm:flex-row gap-6 sm:gap-10 justify-between items-start sm:items-end border-b border-brand-gray-01">
								<div className="flex flex-col gap-2">
									<div>
										<h2 className="text-[2.5rem] font-bold text-brand-navy inline">
											{typeof listing.price === "number" && listing.price !== 0
												? formatPrice(listing.price)
												: "Contact for price"}
										</h2>
										{typeof listing.price === "number" &&
											listing.textAfterPrice && (
												<span className="inline text-sm ml-2">
													{listing.textAfterPrice}
												</span>
											)}
									</div>
									<span className="text-base font-light text-brand-gray-03">
										{listing.streetAddress}, {listing.city}, {listing.state}{" "}
										{listing.zipCode}
									</span>
								</div>
								<div className="flex gap-2 justify-start sm:justify-end flex-wrap">
									{typeof listing.bedrooms === "number" &&
										listing.bedrooms > 0 && (
											<div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
												<FontAwesomeIcon icon={faBedFront} className="w-6" />
												<span className="text-base text-brand-gray-06 font-light">
													{formatNumber(listing.bedrooms)}
												</span>
											</div>
										)}
									{typeof listing.bathrooms === "number" &&
										listing.bathrooms > 0 && (
											<div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
												<FontAwesomeIcon icon={faBath} className="w-6" />
												<span className="text-base text-brand-gray-06 font-light">
													{formatNumber(listing.bathrooms)}
												</span>
											</div>
										)}
									{typeof listing.area === "number" && listing.area !== 0 && (
										<div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
											<FloorPlanIcon className="w-6" />
											<span className="text-base text-brand-gray-06 font-light">
												{formatNumber(listing.area)} sqft
											</span>
										</div>
									)}
									{typeof listing.acreage === "number" &&
										listing.acreage !== 0 && (
											<div className="p-2 rounded-xl border border-brand-gray-01 flex gap-2 items-center">
												<FontAwesomeIcon
													icon={faFarm}
													className="w-6 text-brand-navy"
												/>
												<span className="text-base text-brand-gray-06 font-light fill-brand-navy">
													{formatNumber(listing.acreage)} acres
												</span>
											</div>
										)}
								</div>
							</div>
							<Accordion
								type="multiple"
								defaultValue={[
									"Overview",
									"Resources",
									"Virtual Tour",
									"Videos",
								]}
							>
								{listing.attachments && listing.attachments.length > 0 && (
									<AccordionItem value="Resources">
										<AccordionTrigger
											className="text-2xl font-bold text-brand-navy hover:no-underline py-10"
											iconClassName="border border-brand-gray-01 w-4 h-4 text-brand-navy fill-brand-navy p-1"
											closedIcon={faChevronDown}
											openIcon={faChevronUp}
										>
											Resources
										</AccordionTrigger>
										<AccordionContent className="pb-10">
											<div className="flex gap-10 flex-wrap">
												{listing.attachments &&
													listing.attachments.length > 0 &&
													listing.attachments.map((attachment, index) => {
														if (typeof attachment.attachment === "object") {
															return (
																<a
																	key={attachment.id}
																	className="flex items-center gap-2"
																	href={
																		(attachment.attachment as Attachment).url ||
																		""
																	}
																	target="_blank"
																>
																	<FontAwesomeIcon
																		icon={faFilePdf}
																		className="w-6 h-auto text-brand-navy"
																	/>
																	<span className="text-base font-bold text-brand-gray-04">
																		{
																			(attachment.attachment as Attachment)
																				.title
																		}
																	</span>
																</a>
															);
														}
														return "";
													})}
											</div>
										</AccordionContent>
									</AccordionItem>
								)}
								{listing.description && (
									<AccordionItem value="Overview">
										<AccordionTrigger
											className="text-2xl font-bold text-brand-navy hover:no-underline py-10"
											iconClassName="border border-brand-gray-01 w-4 h-4 text-brand-navy fill-brand-navy p-1"
											closedIcon={faChevronDown}
											openIcon={faChevronUp}
										>
											Property Overview
										</AccordionTrigger>
										<AccordionContent className="pb-10">
											<RichText
												content={listing.description || {}}
												className="p-0 text-brand-gray-04 max-w-none *:text-brand-gray-04 font-light [&>p>strong]:text-brand-gray-04"
											/>
										</AccordionContent>
									</AccordionItem>
								)}
								{listing.videos && listing.videos.length > 0 && (
									<AccordionItem value="Videos">
										<AccordionTrigger
											className="text-2xl font-bold text-brand-navy hover:no-underline py-10"
											iconClassName="border border-brand-gray-01 w-4 h-4 text-brand-navy fill-brand-navy p-1"
											closedIcon={faChevronDown}
											openIcon={faChevronUp}
										>
											Videos
										</AccordionTrigger>
										<AccordionContent className="pb-10">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												{listing.videos.map((video) => {
													// Helper to format video URLs for embedding
													const getEmbedUrl = (url: string) => {
														if (!url) return "";
														// YouTube
														const ytMatch = url.match(
															/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
														);
														if (ytMatch) {
															return `https://www.youtube.com/embed/${ytMatch[1]}`;
														}
														// Vimeo
														const vimeoMatch = url.match(
															/vimeo\.com\/(?:video\/)?([a-zA-Z0-9]+)(?:\/([a-zA-Z0-9]+))?/,
														);
														if (vimeoMatch) {
															console.log(vimeoMatch);
															// If hash exists, append it
															return vimeoMatch[2]
																? `https://player.vimeo.com/video/${vimeoMatch[1]}?h=${vimeoMatch[2]}`
																: `https://player.vimeo.com/video/${vimeoMatch[1]}`;
														}
														// Default: use the URL as-is
														return url;
													};
													return (
														<iframe
															width="100%"
															height="100%"
															src={getEmbedUrl(video.url)}
															frameBorder="0"
															allowFullScreen
															allow="autoplay; fullscreen; web-share; xr-spatial-tracking;"
															className="w-full h-auto aspect-video border-none"
															title={video.title || ""}
															key={video.id}
														></iframe>
													);
												})}
											</div>
										</AccordionContent>
									</AccordionItem>
								)}
								{listing.virtualTourUrl && (
									<AccordionItem value="Virtual Tour">
										<AccordionTrigger
											className="text-2xl font-bold text-brand-navy hover:no-underline py-10"
											iconClassName="border border-brand-gray-01 w-4 h-4 text-brand-navy fill-brand-navy p-1"
											closedIcon={faChevronDown}
											openIcon={faChevronUp}
										>
											Virtual Tour
										</AccordionTrigger>
										<AccordionContent className="pb-10">
											<iframe
												width="100%"
												height="100%"
												src={listing.virtualTourUrl}
												frameBorder="0"
												allowFullScreen
												allow="autoplay; fullscreen; web-share; xr-spatial-tracking;"
												className="w-full h-auto aspect-[3/2] md:aspect-video border-none"
											></iframe>
										</AccordionContent>
									</AccordionItem>
								)}
							</Accordion>
						</div>
						<div className="col-span-1 p-4 py-10 sm:p-10 bg-white border-t-[10px] border-brand-navy flex flex-col h-fit sticky top-24">
							<div className="pb-10 flex gap-10 justify-between items-end">
								<div className="flex flex-col gap-2">
									<h2 className="text-2xl font-bold text-brand-navy">
										Get in Touch
									</h2>
								</div>
							</div>
							{/* @ts-ignore */}
							<FormBlock
								form={sidebarForm}
								styles={{ global: { theme: "thin" }, resp: {} }}
							/>
						</div>
					</div>
				</div>
			</div>
			<ListingMap listing={listing} />

			<ArchiveBlock
				heading="Similar Listings in Your Area"
				blockType="archiveBlock"
				relationTo={"listings"}
				propertyTypes={listing.propertyType}
			/>
			<div className="w-full flex flex-col md:flex-row">
				<Media
					className="w-full min-h-full aspect-[5/4] relative px-5 sm:px-10 lg:px-20"
					imgClassName="object-cover"
					fill
					resource={listing.contactFormImage || listing.featuredImage}
				/>
				<div className="relative w-full px-5 py-20 sm:px-10 sm:py-32 lg:px-20 border-t-[.625rem] border-brand-blue flex flex-col justify-center items-stretch sm:items-start bg-brand-offWhite">
					<Image
						className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-0"
						fill
						src="/pattern-geometric-general.png"
						alt=""
					/>
					<div className="relative z-10 flex flex-col gap-10">
						<div className="flex flex-col gap-4">
							<h2 className="font-bold text-brand-gray-06">Contact Us</h2>
							<p className="text-brand-gray-04 font-light">
								Get in touch today and let us help you find your perfect
								property!
							</p>
						</div>
						{/* @ts-ignore */}
						<FormBlock
							form={footerContactForm}
							styles={{ global: {}, resp: {} }}
						/>
					</div>
				</div>
			</div>
		</article>
	);
}

export async function generateMetadata({
	params: paramsPromise,
}: Args): Promise<Metadata> {
	const { slug = "" } = await paramsPromise;
	const listing = await queryListingBySlug({ slug });

	return generateMeta({ doc: listing });
}

const queryListingBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode();
	const payload = await getPayload({ config: configPromise });

	const result = await payload.find({
		collection: "listings",
		draft,
		limit: 1,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slug,
			},
		},
	});

	return result.docs?.[0] || null;
});
