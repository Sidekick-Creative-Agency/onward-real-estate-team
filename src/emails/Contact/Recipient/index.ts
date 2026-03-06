export const generateContactFormRecipientEmail = (fields: Record<any, any>) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return `
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:37.5em">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding:30px 20px">
              <tbody>
                <tr>
                  <td>
                    <img
                      src="${baseUrl}/onward-logoprimary-color-light.webp"
                      style="display:block;outline:none;border:none;text-decoration:none;max-width:100%;margin:auto" width="128px"/>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="border:1px solid rgb(0,0,0, 0.1);border-radius:3px;overflow:hidden">
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding:20px;padding-bottom:0">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column">
                            <h2
                              style="font-size:26px;font-weight:bold;text-align:center;color:#000000">
                              There is a new form submission on the Onward site.
                            </h2>
                              <p
                              style="font-size:16px;text-align:center;color:#000000">
                              A copy of the form responses are below:
                            </p>
                            <table
                                align="center"
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="margin-top: 32px;">
                                <tbody>
                                    <tr style="width:100%">
                                        <td data-id="__react-email-column">
                                            ${fields
                                              .map((field, index) => {
                                                if (field.value) {
                                                  return `<p key=${index}
                                                style="font-size:16px;line-height:24px;margin:16px 0;color:#000000">
                                                <b>${field.field
                                                  .replaceAll('-', ' ')
                                                  .split(' ')
                                                  .map(
                                                    (word) => word[0].toUpperCase() + word.slice(1),
                                                  )
                                                  .join(' ')}: </b>
                                    ${field.value}
                                            </p>`
                                                }
                                                return ''
                                              })
                                              .join('')}
                                              <p
                                              style="font-size:14px;line-height:24px;margin:auto;color:rgb(0,0,0, 0.5);margin-top:16px;text-align:center"><a href="https://onwardrealestateteam.com/admin/collections/form-submissions" target="_blank" style="text-decoration:underline;color:rgb(0,0,0, 0.5);">Click here</a> to view all form submission.
                                            </p>
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
            <p
              style="font-size:12px;line-height:24px;margin:16px 0 0;text-align:center;color:rgb(0,0,0, 0.7)">
              © ${new Date().getFullYear()} | Onward Real Estate Team
            </p>
            <p
              style="font-size:12px;line-height:24px;margin:0;text-align:center;color:rgb(0,0,0, 0.7)">
              3701 West Waco Drive, Waco, TX 76710
            </p>
            <a
              style="font-size:12px;line-height:24px;margin:0 auto 16px;text-align:center;color:rgb(0,0,0, 0.7);display:inline-block;width:100%;" href="https://onwardrealestateteam.com">
            onwardrealestateteam.com
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    `
}
