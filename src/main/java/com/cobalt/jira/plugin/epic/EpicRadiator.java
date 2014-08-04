package com.cobalt.jira.plugin.epic;

import com.atlassian.sal.api.auth.LoginUriProvider;
import com.atlassian.sal.api.user.UserManager;
import com.atlassian.templaterenderer.TemplateRenderer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class EpicRadiator extends EpicServlet {
    public EpicRadiator(UserManager userManager,
                        LoginUriProvider loginUriProvider,
                        TemplateRenderer templateRenderer) {
        super(userManager, loginUriProvider, templateRenderer);
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processRequest(req, resp, "epic.vm");
    }
}