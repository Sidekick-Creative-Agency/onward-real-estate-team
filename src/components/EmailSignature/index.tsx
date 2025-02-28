export interface EmailSignatureProps {
  name: string
  title: string
  isRealtor: boolean
  email: string
  officePhone: string
  cellPhone: string
  imageSrc: string
  designations?: string
  isAlliance?: boolean
}
export const EmailSignature: React.FC<EmailSignatureProps> = ({
  name,
  title,
  isRealtor,
  isAlliance = false,
  email,
  officePhone,
  cellPhone,
  imageSrc,
  designations,
}) => {
  return (
    <table style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
      <tbody style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
        <tr style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
          <td style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
            <table
              style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}
            >
              <tbody
                style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}
              >
                <tr
                  style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}
                >
                  <td
                    style={{
                      margin: 0,
                      padding: '0 24px 0 0',
                      border: '0px solid transparent',
                      lineHeight: 1,
                    }}
                  >
                    <img
                      src={imageSrc}
                      width="128px"
                      height="128px"
                      alt={`${name} Headshot`}
                      style={{ width: '128px', height: '128px', objectFit: 'cover' }}
                    />
                  </td>
                  <td
                    style={{
                      margin: 0,
                      padding: 0,
                      border: '0px solid transparent',
                      lineHeight: 1,
                    }}
                  >
                    <table
                      style={{
                        margin: 0,

                        padding: 0,
                        border: '0px solid transparent',
                        lineHeight: 1,
                      }}
                    >
                      <tbody
                        style={{
                          margin: 0,
                          padding: 0,
                          border: '0px solid transparent',
                          lineHeight: 1,
                        }}
                      >
                        <tr
                          style={{
                            margin: 0,
                            padding: 0,
                            border: '0px solid transparent',
                            lineHeight: 1,
                          }}
                        >
                          <td
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <h2
                              style={{
                                fontFamily: "Georgia, 'Times New Roman', Times, serif",
                                margin: 0,
                                lineHeight: 1,
                                fontWeight: 'bold',
                                color: '#0b2a35',
                                fontSize: '20px',
                              }}
                            >
                              {name}
                            </h2>
                          </td>
                        </tr>
                        <tr
                          style={{
                            margin: 0,
                            padding: 0,
                            border: '0px solid transparent',
                            lineHeight: 1,
                            height: 0,
                          }}
                        >
                          <td
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                              height: 0,
                            }}
                          >
                            <p style={{ fontSize: '0px', lineHeight: '4px', color: '#FFF' }}>a</p>
                          </td>
                        </tr>
                        <tr
                          style={{
                            margin: 0,
                            padding: 0,
                            border: '0px solid transparent',
                            lineHeight: 1,
                          }}
                        >
                          <td
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <p
                              style={{
                                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                margin: 0,
                                lineHeight: 1,
                                fontSize: '11px',
                                color: '#0b2a35',
                                fontWeight: 500,
                              }}
                            >
                              {title}
                            </p>
                          </td>
                        </tr>
                        <tr
                          style={{
                            margin: 0,
                            padding: 0,
                            border: '0px solid transparent',
                            lineHeight: 1,
                          }}
                        >
                          <td
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <p style={{ fontSize: '0px', lineHeight: '4px', color: '#FFF' }}>a</p>
                          </td>
                        </tr>
                        <tr
                          style={{
                            margin: 0,
                            padding: 0,
                            border: '0px solid transparent',
                            lineHeight: 1,
                          }}
                        >
                          <td
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <table
                              style={{
                                margin: 0,
                                padding: 0,
                                border: '0px solid transparent',
                                lineHeight: 1,
                              }}
                            >
                              <tbody
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  border: '0px solid transparent',
                                  lineHeight: 1,
                                }}
                              >
                                <tr
                                  style={{
                                    margin: 0,
                                    padding: 0,
                                    border: '0px solid transparent',
                                    lineHeight: 1,
                                  }}
                                >
                                  <td
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      border: '0px solid transparent',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <p
                                      style={{ fontSize: '0px', lineHeight: '4px', color: '#FFF' }}
                                    >
                                      a
                                    </p>
                                  </td>
                                </tr>
                                <tr
                                  style={{
                                    margin: 0,
                                    padding: 0,
                                    border: '0px solid transparent',
                                    lineHeight: 1,
                                  }}
                                >
                                  {isRealtor ? (
                                    <td
                                      style={{
                                        margin: 0,
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                        padding: '2px 8px',
                                        backgroundColor: '#ccb6a6',
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontFamily:
                                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                          fontWeight: 'bold',
                                          fontSize: '11px',
                                          lineHeight: 1,
                                          color: '#ffffff',
                                        }}
                                      >
                                        REALTOR<sup>®</sup>
                                        {designations && `, ${designations}`}
                                      </span>
                                    </td>
                                  ) : (
                                    <td
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '0px',
                                          lineHeight: '6px',
                                          color: '#FFF',
                                        }}
                                      >
                                        a
                                      </p>
                                      <hr
                                        style={{
                                          border: 'none',
                                          borderTop: '2px solid #ccb6a6',
                                          width: '72px',
                                        }}
                                      />
                                      <p
                                        style={{
                                          fontSize: '0px',
                                          lineHeight: '6px',
                                          color: '#FFF',
                                        }}
                                      >
                                        a
                                      </p>
                                    </td>
                                  )}
                                </tr>
                                <tr
                                  style={{
                                    margin: 0,
                                    padding: 0,
                                    border: '0px solid transparent',
                                    lineHeight: 1,
                                  }}
                                >
                                  <td
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      border: '0px solid transparent',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <p
                                      style={{ fontSize: '0px', lineHeight: '8px', color: '#FFF' }}
                                    >
                                      a
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr
                          style={{
                            margin: 0,
                            padding: 0,
                            border: '0px solid transparent',
                            lineHeight: 1,
                          }}
                        >
                          <td
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <table
                              style={{
                                margin: 0,
                                padding: 0,
                                border: '0px solid transparent',
                                lineHeight: 1,
                              }}
                            >
                              <tbody
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  border: '0px solid transparent',
                                  lineHeight: 1,
                                }}
                              >
                                <tr
                                  style={{
                                    margin: 0,
                                    padding: 0,
                                    border: '0px solid transparent',
                                    lineHeight: 1,
                                  }}
                                >
                                  <td
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      border: '0px solid transparent',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <table
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                      }}
                                    >
                                      <tbody
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          border: '0px solid transparent',
                                          lineHeight: 1,
                                        }}
                                      >
                                        <tr
                                          style={{
                                            margin: 0,
                                            padding: 0,
                                            border: '0px solid transparent',
                                            lineHeight: 1,
                                          }}
                                        >
                                          <td
                                            style={{
                                              margin: 0,
                                              padding: '0 4px 0 0',
                                              border: '0px solid transparent',
                                              lineHeight: 1,
                                            }}
                                          >
                                            <img
                                              style={{
                                                width: '12px',

                                                lineHeight: 1,
                                                verticalAlign: 'middle',
                                              }}
                                              width="12"
                                              src="https://onward-real-estate.vercel.app/api/media/file/envelope-duotone-solid.webp"
                                              alt="Envelope icon"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              margin: 0,
                                              padding: 0,
                                              border: '0px solid transparent',
                                              lineHeight: 1,
                                              //   paddingLeft: '2px',
                                            }}
                                          >
                                            <a
                                              style={{
                                                lineHeight: 1,
                                                verticalAlign: 'middle',
                                                color: '#0b2a35',
                                                fontFamily:
                                                  "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                fontSize: '12px',
                                                textDecoration: 'none',
                                              }}
                                              href={`mailto:${email}`}
                                            >
                                              {email}
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td
                                    style={{
                                      margin: 0,
                                      padding: '0 0 0 6px',
                                      border: '0px solid transparent',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <table
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                      }}
                                    >
                                      <tbody
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          border: '0px solid transparent',
                                          lineHeight: 1,
                                        }}
                                      >
                                        <tr
                                          style={{
                                            margin: 0,
                                            padding: 0,
                                            border: '0px solid transparent',
                                            lineHeight: 1,
                                          }}
                                        >
                                          <td
                                            style={{
                                              margin: 0,
                                              padding: '0 4px 0 0',
                                              border: '0px solid transparent',
                                              lineHeight: 1,
                                            }}
                                          >
                                            <img
                                              style={{
                                                display: 'inline',
                                                width: '12px',
                                                lineHeight: 1,
                                                verticalAlign: 'middle',
                                              }}
                                              width="12"
                                              src="https://onward-real-estate.vercel.app/api/media/file/phone-duotone-solid (1).webp"
                                              alt="Phone icon"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              margin: 0,
                                              padding: 0,
                                              border: '0px solid transparent',
                                              lineHeight: 1,
                                              //   paddingLeft: '2px',
                                            }}
                                          >
                                            <a
                                              style={{
                                                display: 'inline',
                                                lineHeight: 1,
                                                verticalAlign: 'middle',
                                                color: '#0b2a35',
                                                fontFamily:
                                                  "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                fontSize: '12px',
                                                textDecoration: 'none',
                                              }}
                                              href={`tel:${officePhone.replaceAll('.', '')}`}
                                            >
                                              {officePhone}
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  {cellPhone && (
                                    <td
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                        paddingLeft: '6px',
                                      }}
                                    >
                                      <table
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          border: '0px solid transparent',
                                          lineHeight: 1,
                                        }}
                                      >
                                        <tbody
                                          style={{
                                            margin: 0,
                                            padding: 0,
                                            border: '0px solid transparent',
                                            lineHeight: 1,
                                          }}
                                        >
                                          <tr
                                            style={{
                                              margin: 0,
                                              padding: 0,
                                              border: '0px solid transparent',
                                              lineHeight: 1,
                                            }}
                                          >
                                            <td
                                              style={{
                                                margin: 0,
                                                padding: '0 4px 0 0',
                                                border: '0px solid transparent',
                                                lineHeight: 1,
                                              }}
                                            >
                                              <img
                                                style={{
                                                  display: 'inline',
                                                  width: '10px',
                                                  lineHeight: 1,
                                                  verticalAlign: 'middle',
                                                }}
                                                width="10"
                                                src="https://onward-real-estate.vercel.app/api/media/file/tablet-duotone-solid (1).webp"
                                                alt="Tablet icon"
                                              />
                                            </td>
                                            <td
                                              style={{
                                                margin: 0,
                                                padding: 0,
                                                border: '0px solid transparent',
                                                lineHeight: 1,
                                                //   paddingLeft: '2px',
                                              }}
                                            >
                                              <a
                                                style={{
                                                  display: 'inline',
                                                  lineHeight: 1,
                                                  verticalAlign: 'middle',
                                                  color: '#0b2a35',
                                                  fontFamily:
                                                    "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                                  fontSize: '12px',
                                                  textDecoration: 'none',
                                                }}
                                                href={`tel:${cellPhone.replaceAll('.', '')}`}
                                              >
                                                {cellPhone}
                                              </a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  )}

                                  <td
                                    style={{
                                      margin: 0,
                                      padding: '0 0 0 6px',
                                      border: '0px solid transparent',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <table
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                      }}
                                    >
                                      <tbody
                                        style={{
                                          margin: 0,
                                          padding: 0,
                                          border: '0px solid transparent',
                                          lineHeight: 1,
                                        }}
                                      >
                                        <tr
                                          style={{
                                            margin: 0,
                                            padding: 0,
                                            border: '0px solid transparent',
                                            lineHeight: 1,
                                          }}
                                        >
                                          <td
                                            style={{
                                              margin: 0,
                                              padding: '0 4px 0 0',
                                              border: '0px solid transparent',
                                              lineHeight: 1,
                                            }}
                                          >
                                            <img
                                              style={{
                                                display: 'inline',
                                                width: '8px',
                                                lineHeight: 1,
                                                verticalAlign: 'middle',
                                              }}
                                              width="8"
                                              src="https://onward-real-estate.vercel.app/api/media/file/arrow-pointer-duotone-solid.webp"
                                              alt="Arrow pointer icon"
                                            />
                                          </td>
                                          <td
                                            style={{
                                              margin: 0,
                                              padding: 0,
                                              border: '0px solid transparent',
                                              lineHeight: 1,
                                              //   paddingLeft: '2px',
                                            }}
                                          >
                                            <a
                                              style={{
                                                display: 'inline',
                                                lineHeight: 1,
                                                verticalAlign: 'middle',
                                                color: '#0b2a35',
                                                fontFamily:
                                                  "'Helvetica Neue', Helvetica, Arial,sans-serif",
                                                fontSize: '12px',
                                                textDecoration: 'none',
                                              }}
                                              href="https://www.onwardret.com"
                                            >
                                              www.OnwardRET.com
                                            </a>
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
        <tr style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
          <td
            style={{
              margin: 0,
              padding: 0,
              border: '0px solid transparent',
              lineHeight: 1,
            }}
          >
            <p style={{ fontSize: '0px', lineHeight: '24px', color: '#FFF' }}>a</p>
          </td>
        </tr>
        <tr style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
          <td style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
            <hr style={{ border: '0px solid transparent', borderTop: '1px solid #ccc' }} />
          </td>
        </tr>
        <tr style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
          <td
            style={{
              margin: 0,
              padding: 0,
              border: '0px solid transparent',
              lineHeight: 1,
            }}
          >
            <p style={{ fontSize: '0px', lineHeight: '24px', color: '#FFF' }}>a</p>
          </td>
        </tr>
        <tr style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
          <td style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}>
            <table
              style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}
            >
              <tbody
                style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}
              >
                <tr
                  style={{ margin: 0, padding: 0, border: '0px solid transparent', lineHeight: 1 }}
                >
                  <td
                    style={{
                      margin: 0,
                      padding: 0,
                      border: '0px solid transparent',
                      lineHeight: 1,
                    }}
                  >
                    <table
                      style={{
                        margin: 0,
                        padding: 0,
                        border: '0px solid transparent',
                        lineHeight: 1,
                      }}
                    >
                      <tbody
                        style={{
                          margin: 0,
                          padding: 0,
                          border: '0px solid transparent',
                          lineHeight: 1,
                        }}
                      >
                        <tr
                          style={{
                            margin: 0,
                            padding: 0,
                            border: '0px solid transparent',
                            lineHeight: 1,
                          }}
                        >
                          <td
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <table
                              style={{
                                margin: 0,
                                padding: 0,
                                border: '0px solid transparent',
                                lineHeight: 1,
                              }}
                            >
                              <tbody
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  border: '0px solid transparent',
                                  lineHeight: 1,
                                }}
                              >
                                <tr
                                  style={{
                                    margin: 0,
                                    padding: 0,
                                    border: '0px solid transparent',
                                    lineHeight: 1,
                                  }}
                                >
                                  <td
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      border: '0px solid transparent',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {isAlliance ? (
                                      <img
                                        src="https://onward-real-estate.vercel.app/api/media/file/onward-alliance-logo-primary-color-dark%20copy.webp"
                                        width="160"
                                        height="48"
                                        style={{
                                          objectFit: 'contain',
                                          width: '160px',
                                          height: 'auto',
                                        }}
                                        alt="Onward Real Estate Logo"
                                      />
                                    ) : (
                                      <img
                                        src="https://onward-real-estate.vercel.app/api/media/file/onward-logoprimary-color-dark%20copy.webp"
                                        width="160"
                                        style={{
                                          objectFit: 'contain',
                                          width: '160px',
                                          height: 'auto',
                                        }}
                                        alt="Onward Real Estate Logo"
                                      />
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  {!isAlliance && (
                    <td
                      style={{
                        margin: 0,
                        padding: 0,
                        border: '0px solid transparent',
                        lineHeight: 1,
                      }}
                    >
                      <table
                        style={{
                          margin: '0 0 0 80px',
                          padding: 0,
                          border: '0px solid transparent',
                          lineHeight: 1,
                          width: '450px',
                        }}
                      >
                        <tbody
                          style={{
                            margin: 0,
                            padding: 0,
                            border: '0px solid transparent',
                            lineHeight: 1,
                          }}
                        >
                          <tr
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <td
                              style={{
                                margin: 0,
                                padding: 0,
                                border: '0px solid transparent',
                                lineHeight: 1,
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  lineHeight: 1.5,
                                  fontSize: '10px',
                                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                  color: '#ccb6a6',
                                }}
                              >
                                Texas Law requires Real Estate Brokers to provide the attached
                                Information About Brokerage Services and Consumer Protection Notice.
                                Please click on the links below for more information.
                              </p>
                            </td>
                          </tr>
                          <tr
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <td
                              style={{
                                margin: 0,
                                padding: 0,
                                border: '0px solid transparent',
                                lineHeight: 1,
                              }}
                            >
                              <p style={{ fontSize: '0px', lineHeight: '4px', color: '#FFF' }}>a</p>
                            </td>
                          </tr>
                          <tr
                            style={{
                              margin: 0,
                              padding: 0,
                              border: '0px solid transparent',
                              lineHeight: 1,
                            }}
                          >
                            <td
                              style={{
                                margin: 0,
                                padding: 0,
                                border: '0px solid transparent',
                                lineHeight: 1,
                              }}
                            >
                              <table
                                style={{
                                  margin: 0,
                                  padding: 0,
                                  border: '0px solid transparent',
                                  lineHeight: 1,
                                }}
                              >
                                <tbody
                                  style={{
                                    margin: 0,
                                    padding: 0,
                                    border: '0px solid transparent',
                                    lineHeight: 1,
                                  }}
                                >
                                  <tr
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      border: '0px solid transparent',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <td
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontSize: '0px',
                                          lineHeight: '4px',
                                          color: '#FFFFFF',
                                        }}
                                      >
                                        a
                                      </p>
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      margin: 0,
                                      padding: 0,
                                      border: '0px solid transparent',
                                      lineHeight: 1,
                                    }}
                                  >
                                    <td
                                      style={{
                                        margin: 0,
                                        padding: 0,
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                        width: 'fit-content',
                                      }}
                                    >
                                      <a
                                        style={{
                                          fontSize: '12px',
                                          fontFamily:
                                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                          color: '#ccb6a6',
                                          textDecoration: 'none',
                                        }}
                                        href={`${process.env.NEXT_PUBLIC_SERVER_URL}/brokerage-services/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Information About Brokerage Services
                                      </a>
                                    </td>
                                    <td
                                      style={{
                                        margin: 0,
                                        padding: '0 0 0 32px',
                                        border: '0px solid transparent',
                                        lineHeight: 1,
                                      }}
                                    >
                                      <a
                                        style={{
                                          fontSize: '12px',
                                          fontFamily:
                                            "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                          color: '#ccb6a6',
                                          textDecoration: 'none',
                                        }}
                                        href={`${process.env.NEXT_PUBLIC_SERVER_URL}/consumer-protection/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Consumer Protection Notice
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
