'use client'
import { Button } from "@/components/ui/button";
import { Media, TeamMember } from "@/payload-types";
import { useRef } from "react";

export const TeamMemberSignature: React.FC<{ teamMember: TeamMember }> = ({ teamMember }) => {
    const teamMemberRef = useRef<HTMLTableElement | null>(null)

    async function copyHtmlElementToClipboard(element: HTMLTableElement) {
        try {

            if (!element) {
                console.error('Element not found');
                return;
            }

            // Get the innerHTML of the element
            const htmlContent = element.outerHTML;

            // Create a Blob with the HTML content and 'text/html' type
            const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

            // Create a ClipboardItem with the HTML Blob
            const clipboardItem = new ClipboardItem({ 'text/html': htmlBlob });

            // Write the ClipboardItem to the clipboard
            await navigator.clipboard.write([clipboardItem]);

            console.log('HTML content copied to clipboard successfully!');
            alert('Email signature copied to clipboard successfully!');
        } catch (err) {
            console.error('Failed to copy HTML content:', err);
            alert('Failed to copy email signature: ' + err);
        }
    }

    return (
        <div className='flex flex-col items-start gap-10 scroll-m-36' id={`email-signature-${teamMember.slug}`}>
            <table style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }} ref={teamMemberRef}>
                <tbody style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}>
                    <tr style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}>
                        <td style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}>
                            <table
                                style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}
                            >
                                <tbody
                                    style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}
                                >
                                    <tr
                                        style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}
                                    >
                                        <td
                                            style={{
                                                margin: 0,
                                                padding: 0,
                                                border: "0px solid transparent",
                                                lineHeight: 1
                                            }}
                                        >
                                            <table
                                                style={{
                                                    margin: "0 80px 0 0",
                                                    padding: 0,
                                                    border: "0px solid transparent",
                                                    lineHeight: 1,
                                                    width: "450px"
                                                }}
                                            >
                                                <tbody
                                                    style={{
                                                        margin: 0,
                                                        padding: 0,
                                                        border: "0px solid transparent",
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    <tr
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            border: "0px solid transparent",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                margin: 0,
                                                                padding: 0,
                                                                border: "0px solid transparent",
                                                                lineHeight: 1
                                                            }}
                                                        >
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                    lineHeight: 1.5,
                                                                    fontSize: "10px",
                                                                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                    color: "#ccb6a6",
                                                                }}
                                                            >
                                                                Texas Law requires Real Estate Brokers to provide the attached
                                                                Information About Brokerage Services and Consumer Protection
                                                                Notice. Please click on the links below for more information.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            border: "0px solid transparent",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                margin: 0,
                                                                padding: "8px 0px 0px 0px",
                                                                border: "0px solid transparent",
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            <table
                                                                style={{
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    border: "0px solid transparent",
                                                                    lineHeight: 1
                                                                }}
                                                            >
                                                                <tbody
                                                                    style={{
                                                                        margin: 0,
                                                                        padding: 0,
                                                                        border: "0px solid transparent",
                                                                        lineHeight: 1
                                                                    }}
                                                                >
                                                                    <tr
                                                                        style={{
                                                                            margin: 0,
                                                                            padding: 0,
                                                                            border: "0px solid transparent",
                                                                            lineHeight: 1
                                                                        }}
                                                                    >
                                                                        <td
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: 0,
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1,
                                                                                width: "fit-content"
                                                                            }}
                                                                        >
                                                                            <a
                                                                                style={{
                                                                                    fontSize: "10px",
                                                                                    fontFamily:
                                                                                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                                    color: "#ccb6a6",
                                                                                    textDecoration: "none",
                                                                                    fontWeight: 600,
                                                                                }}
                                                                                href={process.env.NEXT_PUBLIC_SERVER_URL + (teamMember.details.iabsForm ? (teamMember.details.iabsForm as Media)?.url : '/api/attachments/file/onward-IABS-2026-ujviUU1HEd.pdf')}
                                                                                rel="noopener noreferrer"
                                                                            >Information About Brokerage Services</a>
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: "0 0 0 32px",
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1,
                                                                            }}
                                                                        >
                                                                            <a
                                                                                style={{
                                                                                    fontSize: "10px",
                                                                                    fontFamily:
                                                                                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                                    color: "#ccb6a6",
                                                                                    textDecoration: "none",
                                                                                    fontWeight: 600,
                                                                                }}
                                                                                href="https://onwardrealestateteam.com/wp-content/uploads/2024/02/TREC-CPN-09-2023.pdf"
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >Consumer Protection Notice</a>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td
                                            style={{
                                                margin: 0,
                                                padding: 0,
                                                border: "0px solid transparent",
                                                lineHeight: 1
                                            }}
                                        >
                                            <table
                                                style={{
                                                    margin: 0,
                                                    padding: 0,
                                                    border: "0px solid transparent",
                                                    lineHeight: 1
                                                }}
                                            >
                                                <tbody
                                                    style={{
                                                        margin: 0,
                                                        padding: 0,
                                                        border: "0px solid transparent",
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    <tr
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            border: "0px solid transparent",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                margin: 0,
                                                                padding: 0,
                                                                border: "0px solid transparent",
                                                                lineHeight: 1
                                                            }}
                                                        >
                                                            <table
                                                                style={{
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    border: "0px solid transparent",
                                                                    lineHeight: 1
                                                                }}
                                                            >
                                                                <tbody
                                                                    style={{
                                                                        margin: 0,
                                                                        padding: 0,
                                                                        border: "0px solid transparent",
                                                                        lineHeight: 1
                                                                    }}
                                                                >
                                                                    <tr
                                                                        style={{
                                                                            margin: 0,
                                                                            padding: 0,
                                                                            border: "0px solid transparent",
                                                                            lineHeight: 1
                                                                        }}
                                                                    >
                                                                        <td
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: 0,
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1,
                                                                                width: "160px",
                                                                                minWidth: "160px",
                                                                                maxWidth: "160px",
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={teamMember.details.company === 'onward' ? "https://www.onwardrealestateteam.com/api/media/file/onward-logoprimary-kellerw-color-dark-300x120.png" : "https://www.onwardrealestateteam.com/api/media/file/onward-alliance-logo-primary-color-dark.webp"}
                                                                                width="160"
                                                                                style={{
                                                                                    objectFit: "contain",
                                                                                    width: "160px",
                                                                                    minWidth: "160px",
                                                                                    maxWidth: "160px",
                                                                                    height: "auto",
                                                                                }}
                                                                                alt={teamMember.details.company === 'onward' ? "Onward Real Estate Logo" : "Alliance Property Management Logo"}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}>
                        <td
                            style={{
                                margin: 0,
                                padding: "24px 0px",
                                border: "0px solid transparent",
                                lineHeight: 1,
                            }}
                        >
                            <hr
                                style={{ border: "0px solid transparent", borderTop: "1px solid #ddd", margin: 0 }}
                            />
                        </td>
                    </tr>
                    <tr style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}>
                        <td
                            style={{
                                margin: 0,
                                padding: 0,
                                border: "0px solid transparent",
                                lineHeight: 1,
                                minWidth: "690px",
                            }}
                        >
                            <table
                                style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}
                            >
                                <tbody
                                    style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}
                                >
                                    <tr
                                        style={{ margin: 0, padding: 0, border: "0px solid transparent", lineHeight: 1 }}
                                    >
                                        <td
                                            style={{
                                                margin: 0,
                                                padding: "0 24px 0 0",
                                                border: "0px solid transparent",
                                                lineHeight: 1,
                                            }}
                                        >
                                            <img
                                                src={process.env.NEXT_PUBLIC_SERVER_URL + (teamMember.details.emailSignatureHeadshot as Media)?.thumbnailURL || undefined}
                                                width="128px"
                                                height="128px"
                                                alt={`${teamMember.title} Headshot`}
                                                style={{
                                                    width: "128px",
                                                    height: "128px",
                                                    objectFit: "cover",
                                                    objectPosition: "50% 15%",
                                                    borderRadius: "50%",
                                                    minWidth: "128px",
                                                    maxWidth: "128px",
                                                }}
                                            />
                                        </td>
                                        <td
                                            style={{
                                                margin: 0,
                                                padding: 0,
                                                border: "0px solid transparent",
                                                lineHeight: 1
                                            }}
                                        >
                                            <table
                                                style={{
                                                    margin: 0,
                                                    padding: 0,
                                                    border: "0px solid transparent",
                                                    lineHeight: 1
                                                }}
                                            >
                                                <tbody
                                                    style={{
                                                        margin: 0,
                                                        padding: 0,
                                                        border: "0px solid transparent",
                                                        lineHeight: 1
                                                    }}
                                                >
                                                    <tr
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            border: "0px solid transparent",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                margin: 0,
                                                                padding: 0,
                                                                border: "0px solid transparent",
                                                                lineHeight: 1
                                                            }}
                                                        >
                                                            <h2
                                                                style={{
                                                                    fontFamily: "Georgia, 'Times New Roman', Times, serif",
                                                                    margin: 0,
                                                                    lineHeight: 1,
                                                                    fontWeight: "bold",
                                                                    color: "#0b2a35",
                                                                    fontSize: "20px",
                                                                }}
                                                            >
                                                                {teamMember.title}
                                                            </h2>
                                                        </td>
                                                    </tr>
                                                    <tr
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            border: "0px solid transparent",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                margin: 0,
                                                                padding: "8px 0px",
                                                                border: "0px solid transparent",
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            <p
                                                                style={{
                                                                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                    margin: 0,
                                                                    lineHeight: 1,
                                                                    fontSize: "11px",
                                                                    color: "#0b2a35",
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                {teamMember.details.jobTitle}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    {teamMember.details.isRealtor ? <tr
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            border: "0px solid transparent",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                margin: 0,
                                                                padding: 0,
                                                                border: "0px solid transparent",
                                                                lineHeight: 1
                                                            }}
                                                        >
                                                            <table
                                                                style={{
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    border: "0px solid transparent",
                                                                    lineHeight: 1
                                                                }}
                                                            >
                                                                <tbody
                                                                    style={{
                                                                        margin: 0,
                                                                        padding: 0,
                                                                        border: "0px solid transparent",
                                                                        lineHeight: 1
                                                                    }}
                                                                >
                                                                    <tr
                                                                        style={{
                                                                            margin: 0,
                                                                            padding: 0,
                                                                            border: "0px solid transparent",
                                                                            lineHeight: 1
                                                                        }}
                                                                    >
                                                                        <td
                                                                            style={{
                                                                                margin: 0,
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1,
                                                                                padding: "4px 8px",
                                                                                display: "flex",
                                                                                backgroundColor: "#ccb6a6",
                                                                            }}
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    fontFamily:
                                                                                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                                    fontWeight: "bold",
                                                                                    fontSize: "11px",
                                                                                    lineHeight: 1,
                                                                                    color: "#ffffff",
                                                                                }}
                                                                            >REALTOR<sup>®</sup>{teamMember.details.designations && `, ${teamMember.details.designations}`}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr> : <tr
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            border: "0px solid transparent",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                margin: 0,
                                                                padding: 0,
                                                                border: "0px solid transparent",
                                                                lineHeight: 1
                                                            }}
                                                        >
                                                            <table
                                                                style={{
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    border: "0px solid transparent",
                                                                    lineHeight: 1
                                                                }}
                                                            >
                                                                <tbody
                                                                    style={{
                                                                        margin: 0,
                                                                        padding: 0,
                                                                        border: "0px solid transparent",
                                                                        lineHeight: 1
                                                                    }}
                                                                >
                                                                    <tr
                                                                        style={{
                                                                            margin: 0,
                                                                            padding: 0,
                                                                            border: "0px solid transparent",
                                                                            lineHeight: 1
                                                                        }}
                                                                    >
                                                                        <td
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: 0,
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1
                                                                            }}
                                                                        >
                                                                            <hr
                                                                                style={{
                                                                                    border: "none",
                                                                                    borderTop: "2px solid #ccb6a6",
                                                                                    width: "72px",
                                                                                    margin: 0,
                                                                                    padding: 0,
                                                                                }}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>}


                                                    <tr
                                                        style={{
                                                            margin: 0,
                                                            padding: 0,
                                                            border: "0px solid transparent",
                                                            lineHeight: 1
                                                        }}
                                                    >
                                                        <td
                                                            style={{
                                                                margin: 0,
                                                                padding: "12px 0px 0px 0px",
                                                                border: "0px solid transparent",
                                                                lineHeight: 1,
                                                            }}
                                                        >
                                                            <table
                                                                style={{
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    border: "0px solid transparent",
                                                                    lineHeight: 1
                                                                }}
                                                            >
                                                                <tbody
                                                                    style={{
                                                                        margin: 0,
                                                                        padding: 0,
                                                                        border: "0px solid transparent",
                                                                        lineHeight: 1
                                                                    }}
                                                                >
                                                                    <tr
                                                                        style={{
                                                                            margin: 0,
                                                                            padding: 0,
                                                                            border: "0px solid transparent",
                                                                            lineHeight: 1
                                                                        }}
                                                                    >
                                                                        <td
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: 0,
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1
                                                                            }}
                                                                        >
                                                                            <table
                                                                                style={{
                                                                                    margin: 0,
                                                                                    padding: 0,
                                                                                    border: "0px solid transparent",
                                                                                    lineHeight: 1
                                                                                }}
                                                                            >
                                                                                <tbody
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        padding: 0,
                                                                                        border: "0px solid transparent",
                                                                                        lineHeight: 1
                                                                                    }}
                                                                                >
                                                                                    <tr
                                                                                        style={{
                                                                                            margin: 0,
                                                                                            padding: 0,
                                                                                            border: "0px solid transparent",
                                                                                            lineHeight: 1,
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                        }}
                                                                                    >
                                                                                        <td
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                padding: "0 4px 0 0",
                                                                                                width: "16px",
                                                                                                minWidth: "16px",
                                                                                                maxWidth: "16px",
                                                                                                border: "0px solid transparent",
                                                                                                lineHeight: 1,
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                style={{
                                                                                                    width: "12px",
                                                                                                    minWidth: "12px",
                                                                                                    maxWidth: "12px",
                                                                                                    lineHeight: 1,
                                                                                                    verticalAlign: "middle",
                                                                                                    objectFit: "contain",
                                                                                                }}
                                                                                                width="12"
                                                                                                src="https://www.onwardrealestateteam.com/api/media/file/envelope-duotone-solid-300x300.png"
                                                                                                alt="Envelope icon"
                                                                                            />
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                padding: 0,
                                                                                                border: "0px solid transparent",
                                                                                                lineHeight: 1
                                                                                            }}
                                                                                        >
                                                                                            <a
                                                                                                style={{
                                                                                                    lineHeight: 1,
                                                                                                    verticalAlign: "middle",
                                                                                                    color: "#0b2a35",
                                                                                                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                                                    fontSize: "12px",
                                                                                                    textDecoration: "none",
                                                                                                }}
                                                                                                href={`mailto:${teamMember.details.email}`}
                                                                                            >{teamMember.details.email}</a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: "0px 0px 0px 8px",
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1,
                                                                            }}
                                                                        >
                                                                            <table
                                                                                style={{
                                                                                    margin: 0,
                                                                                    padding: 0,
                                                                                    border: "0px solid transparent",
                                                                                    lineHeight: 1
                                                                                }}
                                                                            >
                                                                                <tbody
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        padding: 0,
                                                                                        border: "0px solid transparent",
                                                                                        lineHeight: 1
                                                                                    }}
                                                                                >
                                                                                    <tr
                                                                                        style={{
                                                                                            margin: 0,
                                                                                            padding: 0,
                                                                                            border: "0px solid transparent",
                                                                                            lineHeight: 1,
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                        }}
                                                                                    >
                                                                                        <td
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                padding: "0 4px 0 0",
                                                                                                width: "16px",
                                                                                                minWidth: "16px",
                                                                                                maxWidth: "16px",
                                                                                                border: "0px solid transparent",
                                                                                                lineHeight: 1,
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                style={{
                                                                                                    display: "inline",
                                                                                                    width: "12px",
                                                                                                    minWidth: "12px",
                                                                                                    maxWidth: "12px",
                                                                                                    lineHeight: 1,
                                                                                                    verticalAlign: "middle",
                                                                                                }}
                                                                                                width="12"
                                                                                                src="https://www.onwardrealestateteam.com/api/media/file/phone-duotone-solid (1)-300x300.png"
                                                                                                alt="Phone icon"
                                                                                            />
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                padding: 0,
                                                                                                border: "0px solid transparent",
                                                                                                lineHeight: 1
                                                                                            }}
                                                                                        >
                                                                                            <a
                                                                                                style={{
                                                                                                    display: "inline",
                                                                                                    lineHeight: 1,
                                                                                                    verticalAlign: "middle",
                                                                                                    color: "#0b2a35",
                                                                                                    fontFamily:
                                                                                                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                                                    fontSize: "12px",
                                                                                                    textDecoration: "none",
                                                                                                }}
                                                                                                href="tel:2548709769"
                                                                                            >254.870.9769</a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                        {teamMember.details.phone && <td
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: "0px 0px 0px 8px",
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1,
                                                                            }}
                                                                        >
                                                                            <table
                                                                                style={{
                                                                                    margin: 0,
                                                                                    padding: 0,
                                                                                    border: "0px solid transparent",
                                                                                    lineHeight: 1
                                                                                }}
                                                                            >
                                                                                <tbody
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        padding: 0,
                                                                                        border: "0px solid transparent",
                                                                                        lineHeight: 1
                                                                                    }}
                                                                                >
                                                                                    <tr
                                                                                        style={{
                                                                                            margin: 0,
                                                                                            padding: 0,
                                                                                            border: '0px solid transparent',
                                                                                            lineHeight: 1,
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                        }}
                                                                                    >
                                                                                        <td
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                padding: "0 4px 0 0",
                                                                                                width: "14px",
                                                                                                minWidth: "14px",
                                                                                                maxWidth: "14px",
                                                                                                border: "0px solid transparent",
                                                                                                lineHeight: 1,
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                style={{
                                                                                                    display: "inline",
                                                                                                    width: "10px",
                                                                                                    minWidth: "10px",
                                                                                                    maxWidth: "10px",
                                                                                                    lineHeight: 1,
                                                                                                    verticalAlign: "middle",
                                                                                                }}
                                                                                                width="10"
                                                                                                src="https://www.onwardrealestateteam.com/api/media/file/tablet-duotone-solid (1)-300x343.png"
                                                                                                alt="Tablet icon"
                                                                                            />
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                padding: 0,
                                                                                                border: "0px solid transparent",
                                                                                                lineHeight: 1
                                                                                            }}
                                                                                        >
                                                                                            <a
                                                                                                style={{
                                                                                                    display: "inline",
                                                                                                    lineHeight: 1,
                                                                                                    verticalAlign: "middle",
                                                                                                    color: "#0b2a35",
                                                                                                    fontFamily:
                                                                                                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                                                    fontSize: "12px",
                                                                                                    textDecoration: "none",
                                                                                                }}
                                                                                                href={`tel:${teamMember.details.phone?.replaceAll('-', '')}`}
                                                                                            >{teamMember.details.phone?.replaceAll('-', '.')}</a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>}

                                                                        <td
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: "0 0 0 8px",
                                                                                border: "0px solid transparent",
                                                                                lineHeight: 1
                                                                            }}
                                                                        >
                                                                            <table
                                                                                style={{
                                                                                    margin: 0,
                                                                                    padding: 0,
                                                                                    border: "0px solid transparent",
                                                                                    lineHeight: 1
                                                                                }}
                                                                            >
                                                                                <tbody
                                                                                    style={{
                                                                                        margin: 0,
                                                                                        padding: 0,
                                                                                        border: "0px solid transparent",
                                                                                        lineHeight: 1
                                                                                    }}
                                                                                >
                                                                                    <tr
                                                                                        style={{
                                                                                            margin: 0,
                                                                                            padding: 0,
                                                                                            border: "0px solid transparent",
                                                                                            lineHeight: 1,
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                        }}
                                                                                    >
                                                                                        <td
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                padding: "0 4px 0 0",
                                                                                                width: "12px",
                                                                                                minWidth: "12px",
                                                                                                maxWidth: "12px",
                                                                                                border: "0px solid transparent",
                                                                                                lineHeight: 1,
                                                                                            }}
                                                                                        >
                                                                                            <img
                                                                                                style={{
                                                                                                    display: "inline",
                                                                                                    width: "8px",
                                                                                                    minWidth: "8px",
                                                                                                    maxWidth: "8px",
                                                                                                    lineHeight: 1,
                                                                                                    verticalAlign: "middle",
                                                                                                }}
                                                                                                width="8"
                                                                                                src="https://www.onwardrealestateteam.com/api/media/file/arrow-pointer-duotone-solid-300x480.png"
                                                                                                alt="Arrow pointer icon"
                                                                                            />
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                margin: 0,
                                                                                                padding: 0,
                                                                                                border: "0px solid transparent",
                                                                                                lineHeight: 1
                                                                                            }}
                                                                                        >
                                                                                            <a
                                                                                                style={{
                                                                                                    display: "inline",
                                                                                                    lineHeight: 1,
                                                                                                    verticalAlign: "middle",
                                                                                                    color: "#0b2a35",
                                                                                                    fontFamily:
                                                                                                        "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                                                                    fontSize: "12px",
                                                                                                    textDecoration: "none",
                                                                                                }}
                                                                                                href="https://www.onwardret.com"
                                                                                            >www.OnwardRET.com</a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <Button onClick={() => {
                if (!teamMemberRef.current) return
                copyHtmlElementToClipboard(teamMemberRef.current)
            }}>Copy</Button>
        </div>
    )
}